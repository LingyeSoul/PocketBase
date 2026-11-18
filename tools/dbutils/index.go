package dbutils

import (
	"fmt"
	"hash/crc32"
	"regexp"
	"strings"

	"github.com/lingyesoul/pocketbase/tools/tokenizer"
)

var (
	indexRegex       = regexp.MustCompile(`(?i)\s*create\s+(unique\s+)?\s*index\s*(if\s+not\s+exists\s+)?(\S*)\s+on\s+(\S*)\s*\(([\s\S]*?)\)(?:\s+where\s+([\s\S]*?))?\s*$`)
	indexColumnRegex = regexp.MustCompile(`(?i)^([\s\S]+?)(?:\s+collate\s+([\w]+))?(?:\s+(asc|desc))?\s*$`)
)

// IndexColumn represents a single parsed SQL index column.
type IndexColumn struct {
	Name    string `json:"name"` // identifier or expression
	Collate string `json:"collate"`
	Sort    string `json:"sort"`
}

// Index represents a single parsed SQL CREATE INDEX expression.
type Index struct {
	SchemaName string        `json:"schemaName"`
	IndexName  string        `json:"indexName"`
	TableName  string        `json:"tableName"`
	Where      string        `json:"where"`
	Columns    []IndexColumn `json:"columns"`
	Unique     bool          `json:"unique"`
	Optional   bool          `json:"optional"`
}

// IsValid checks if the current Index contains the minimum required fields to be considered valid.
func (idx Index) IsValid() bool {
	return idx.IndexName != "" && idx.TableName != "" && len(idx.Columns) > 0
}

// Build returns a "CREATE INDEX" SQLite SQL string from the current index parts.
//
// Returns empty string if idx.IsValid() is false.
func (idx Index) Build() string {
	sql, _ := idx.BuildFor(DialectSQLite)
	return sql
}

// BuildFor returns a "CREATE INDEX" SQL string for the provided dialect.
//
// MySQL/MariaDB partial unique indexes are rewritten to preserve their
// uniqueness semantics: MySQL uses a functional key part and MariaDB uses a
// deterministic hidden generated column (see PartialUniqueColumnName).
func (idx Index) BuildFor(dialect Dialect) (string, error) {
	if !idx.IsValid() {
		return "", nil
	}

	partialColumn, isPartialUnique := idx.PartialUniqueColumn()
	if isPartialUnique && !dialect.IsSQLite() && !dialect.IsPostgres() {
		if dialect.IsMariaDB() {
			return idx.buildIndex(dialect, []IndexColumn{{Name: idx.PartialUniqueColumnName()}}, "")
		}

		// MySQL 8.0.13+ functional key part.
		return idx.buildMySQLFunctionalUnique(partialColumn)
	}

	if idx.Unique && idx.Where != "" && dialect.IsMySQL() && !isPartialUnique {
		return "", fmt.Errorf("partial unique indexes are not supported by %s", dialect)
	}

	where := idx.Where
	columns := idx.Columns
	if isPartialUnique && dialect.IsMySQL() {
		// non-MariaDB MySQL is handled above; this branch is unreachable
		where = ""
	} else if idx.Where != "" && dialect.IsMySQL() {
		// Non-unique partial indexes can safely index all rows.
		where = ""
	}

	return idx.buildIndex(dialect, columns, where)
}

func (idx Index) buildIndex(dialect Dialect, columns []IndexColumn, where string) (string, error) {
	var str strings.Builder

	str.WriteString("CREATE ")

	if idx.Unique {
		str.WriteString("UNIQUE ")
	}

	str.WriteString("INDEX ")

	if idx.Optional && (dialect.IsSQLite() || dialect.IsPostgres() || dialect.IsMariaDB()) {
		str.WriteString("IF NOT EXISTS ")
	}

	indexName := strings.Trim(idx.IndexName, "`\"'[]")
	if idx.SchemaName != "" && dialect.IsSQLite() {
		str.WriteString(dialect.QuoteIdentifier(idx.SchemaName))
		str.WriteString(".")
		str.WriteString(dialect.QuoteIdentifier(indexName))
	} else {
		str.WriteString(dialect.QuoteIdentifier(indexName))
	}
	str.WriteString(" ON ")

	str.WriteString(quoteQualifiedIdentifier(dialect, idx.TableName))
	str.WriteString(" (")

	if len(columns) > 1 {
		str.WriteString("\n  ")
	}

	var hasCol bool
	for _, col := range columns {
		trimmedColName := strings.TrimSpace(col.Name)
		if trimmedColName == "" {
			continue
		}

		if hasCol {
			str.WriteString(",\n  ")
		}

		isExpression := strings.Contains(trimmedColName, "(") || strings.Contains(trimmedColName, " ")
		quoted := quoteIndexIdentifier(dialect, trimmedColName)

		switch {
		case strings.EqualFold(col.Collate, "nocase") && dialect.IsPostgres():
			if !isExpression {
				quoted = "lower(" + quoted + ")"
			}
		case strings.EqualFold(col.Collate, "nocase") && dialect.IsMySQL():
			quoted += " COLLATE " + dialect.CaseInsensitiveCollation()
		case col.Collate != "" && dialect.IsSQLite():
			quoted += " COLLATE " + col.Collate
		}

		str.WriteString(quoted)

		if col.Sort != "" {
			str.WriteString(" ")
			str.WriteString(strings.ToUpper(col.Sort))
		}

		hasCol = true
	}

	if hasCol && len(columns) > 1 {
		str.WriteString("\n")
	}

	str.WriteString(")")

	if where != "" {
		str.WriteString(" WHERE ")
		str.WriteString(rewriteIndexWhere(dialect, where))
	}

	return str.String(), nil
}

func (idx Index) buildMySQLFunctionalUnique(column string) (string, error) {
	column = strings.Trim(column, "`\"'[] ")
	if column == "" {
		return "", fmt.Errorf("invalid partial unique index %q", idx.IndexName)
	}

	return fmt.Sprintf(
		"CREATE UNIQUE INDEX %s ON %s ((NULLIF(%s, '')))",
		DialectMySQL.QuoteIdentifier(strings.Trim(idx.IndexName, "`\"'[]")),
		quoteQualifiedIdentifier(DialectMySQL, idx.TableName),
		DialectMySQL.QuoteIdentifier(column),
	), nil
}

// PartialUniqueColumn returns the single column of a simple "column != ”" partial unique index.
func (idx Index) PartialUniqueColumn() (string, bool) {
	if !idx.Unique || len(idx.Columns) != 1 || idx.Where == "" {
		return "", false
	}

	column := strings.TrimSpace(idx.Columns[0].Name)
	if column == "" || strings.ContainsAny(column, " ()") {
		return "", false
	}

	where := strings.TrimSpace(idx.Where)
	where = strings.TrimSuffix(where, ";")
	where = strings.TrimSpace(where)

	for _, op := range []string{"!=", "<>"} {
		parts := strings.SplitN(where, op, 2)
		if len(parts) != 2 {
			continue
		}

		left := strings.Trim(strings.TrimSpace(parts[0]), "`\"'[] ")
		right := strings.TrimSpace(parts[1])
		if strings.EqualFold(left, column) && (right == "''" || right == `""`) {
			return column, true
		}
	}

	return "", false
}

// PartialUniqueColumnName returns the deterministic hidden generated column name
// used by MariaDB to emulate a partial unique index.
func (idx Index) PartialUniqueColumnName() string {
	return fmt.Sprintf("_pb_uq_%08x", crc32.ChecksumIEEE([]byte(idx.IndexName)))
}

func quoteQualifiedIdentifier(dialect Dialect, name string) string {
	name = strings.TrimSpace(name)
	if strings.ContainsAny(name, " ()") {
		return name
	}

	parts := strings.Split(name, ".")
	for i, part := range parts {
		parts[i] = dialect.QuoteIdentifier(strings.Trim(part, "`\"'[]"))
	}

	return strings.Join(parts, ".")
}

func quoteIndexIdentifier(dialect Dialect, name string) string {
	if strings.Contains(name, "(") || strings.Contains(name, " ") {
		return name
	}

	return dialect.QuoteIdentifier(strings.Trim(name, "`\"'[]"))
}

func rewriteIndexWhere(dialect Dialect, where string) string {
	if dialect.IsSQLite() {
		return where
	}

	if dialect.IsPostgres() {
		where = strings.ReplaceAll(where, "`", "\"")
	}

	return where
}

// ParseIndex parses the provided "CREATE INDEX" SQL string into Index struct.
func ParseIndex(createIndexExpr string) Index {
	result := Index{}

	matches := indexRegex.FindStringSubmatch(createIndexExpr)
	if len(matches) != 7 {
		return result
	}

	trimChars := "`\"'[]\r\n\t\f\v "

	// Unique
	// ---
	result.Unique = strings.TrimSpace(matches[1]) != ""

	// Optional (aka. "IF NOT EXISTS")
	// ---
	result.Optional = strings.TrimSpace(matches[2]) != ""

	// SchemaName and IndexName
	// ---
	nameTk := tokenizer.NewFromString(matches[3])
	nameTk.Separators('.')

	nameParts, _ := nameTk.ScanAll()
	switch len(nameParts) {
	case 1:
		result.IndexName = strings.Trim(nameParts[0], trimChars)
	case 2:
		result.SchemaName = strings.Trim(nameParts[0], trimChars)
		result.IndexName = strings.Trim(nameParts[1], trimChars)
	}

	// TableName
	// ---
	result.TableName = strings.Trim(matches[4], trimChars)

	// Columns
	// ---
	columnsTk := tokenizer.NewFromString(matches[5])
	columnsTk.Separators(',')

	rawColumns, _ := columnsTk.ScanAll()

	result.Columns = make([]IndexColumn, 0, len(rawColumns))

	for _, col := range rawColumns {
		colMatches := indexColumnRegex.FindStringSubmatch(col)
		if len(colMatches) != 4 {
			continue
		}

		trimmedName := strings.Trim(colMatches[1], trimChars)
		if trimmedName == "" {
			continue
		}

		result.Columns = append(result.Columns, IndexColumn{
			Name:    trimmedName,
			Collate: strings.TrimSpace(colMatches[2]),
			Sort:    strings.ToUpper(colMatches[3]),
		})
	}

	if len(rawColumns) != len(result.Columns) {
		// unset to trigger validation error
		result.Columns = []IndexColumn{}
	}

	// WHERE expression
	// ---
	result.Where = strings.TrimSpace(matches[6])

	return result
}

// FindSingleColumnUniqueIndex returns the first matching single column unique index.
func FindSingleColumnUniqueIndex(indexes []string, column string) (Index, bool) {
	var index Index

	for _, idx := range indexes {
		index := ParseIndex(idx)
		if index.Unique && len(index.Columns) == 1 && strings.EqualFold(index.Columns[0].Name, column) {
			return index, true
		}
	}

	return index, false
}

// Deprecated: Use `_, ok := FindSingleColumnUniqueIndex(indexes, column)` instead.
//
// HasColumnUniqueIndex loosely checks whether the specified column has
// a single column unique index (WHERE statements are ignored).
func HasSingleColumnUniqueIndex(column string, indexes []string) bool {
	_, ok := FindSingleColumnUniqueIndex(indexes, column)
	return ok
}
