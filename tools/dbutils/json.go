package dbutils

import (
	"fmt"
	"strings"
)

// JSONEach returns JSON_EACH SQLite string expression with
// some normalizations for non-json columns.
func JSONEach(column string) string {
	return JSONEachFor(DialectSQLite, column)
}

// JSONEachFor returns a table-valued JSON array expression for the dialect.
//
// The returned expression exposes a "value" column and is intended to be used
// in a FROM/JOIN clause (e.g. "FROM <expr> je").
func JSONEachFor(dialect Dialect, column string) string {
	switch {
	case dialect.IsPostgres():
		return fmt.Sprintf(
			`LATERAL jsonb_array_elements_text(CASE WHEN [[%s]] IS JSON AND jsonb_typeof([[%s]]::jsonb) = 'array' THEN [[%s]]::jsonb ELSE jsonb_build_array([[%s]]) END)`,
			column, column, column, column,
		)
	case dialect.IsMySQL():
		return fmt.Sprintf(
			`JSON_TABLE(IF(JSON_VALID([[%s]]) AND JSON_TYPE([[%s]]) = 'ARRAY', [[%s]], JSON_ARRAY([[%s]])), '$[*]' COLUMNS(value TEXT PATH '$'))`,
			column, column, column, column,
		)
	default:
		// note: we are not using the new and shorter "if(x,y)" syntax for
		// compatibility with custom drivers that use older SQLite version
		return fmt.Sprintf(
			`json_each(CASE WHEN iif(json_valid([[%s]]), json_type([[%s]])='array', FALSE) THEN [[%s]] ELSE json_array([[%s]]) END)`,
			column, column, column, column,
		)
	}
}

// JSONEachParamFor returns a table-valued JSON array expression for a bound parameter.
func JSONEachParamFor(dialect Dialect, placeholder string) string {
	switch {
	case dialect.IsPostgres():
		return fmt.Sprintf(`LATERAL jsonb_array_elements_text((%s)::jsonb)`, placeholder)
	case dialect == DialectMySQL:
		return fmt.Sprintf(`JSON_TABLE(CAST(%s AS JSON), '$[*]' COLUMNS(value TEXT PATH '$'))`, placeholder)
	case dialect.IsMariaDB():
		return fmt.Sprintf(`JSON_TABLE(%s, '$[*]' COLUMNS(value TEXT PATH '$'))`, placeholder)
	default:
		return fmt.Sprintf(`json_each(%s)`, placeholder)
	}
}

// JSONArrayLength returns JSON_ARRAY_LENGTH SQLite string expression
// with some normalizations for non-json columns.
//
// It works with both json and non-json column values.
//
// Returns 0 for empty string or NULL column values.
func JSONArrayLength(column string) string {
	return JSONArrayLengthFor(DialectSQLite, column)
}

// JSONArrayLengthFor returns a dialect-specific JSON array length expression.
func JSONArrayLengthFor(dialect Dialect, column string) string {
	switch {
	case dialect.IsPostgres():
		return fmt.Sprintf(
			`(CASE WHEN [[%s]] = '' OR [[%s]] IS NULL THEN 0 WHEN [[%s]] IS JSON AND jsonb_typeof([[%s]]::jsonb) = 'array' THEN jsonb_array_length([[%s]]::jsonb) ELSE 1 END)`,
			column, column, column, column, column,
		)
	case dialect.IsMySQL():
		return fmt.Sprintf(
			`JSON_LENGTH(CASE WHEN JSON_VALID([[%s]]) AND JSON_TYPE([[%s]]) = 'ARRAY' THEN [[%s]] WHEN [[%s]] = '' OR [[%s]] IS NULL THEN JSON_ARRAY() ELSE JSON_ARRAY([[%s]]) END)`,
			column, column, column, column, column, column,
		)
	default:
		// note: we are not using the new and shorter "if(x,y)" syntax for
		// compatibility with custom drivers that use older SQLite version
		return fmt.Sprintf(
			`json_array_length(CASE WHEN iif(json_valid([[%s]]), json_type([[%s]])='array', FALSE) THEN [[%s]] ELSE (CASE WHEN [[%s]] = '' OR [[%s]] IS NULL THEN json_array() ELSE json_array([[%s]]) END) END)`,
			column, column, column, column, column, column,
		)
	}
}

// JSONExtract returns a JSON_EXTRACT SQLite string expression with
// some normalizations for non-json columns.
func JSONExtract(column string, path string) string {
	return JSONExtractFor(DialectSQLite, column, path)
}

// JSONExtractFor returns a dialect-specific JSON extract expression.
func JSONExtractFor(dialect Dialect, column string, path string) string {
	if path != "" && !strings.HasPrefix(path, "[") && !strings.HasPrefix(path, ".") {
		path = "." + path
	}

	switch {
	case dialect.IsPostgres():
		pgPath := pgJSONPath(path)
		return fmt.Sprintf(
			`(CASE WHEN [[%s]] IS JSON THEN (([[%s]])::jsonb #>> '%s') ELSE (jsonb_build_object('pb', [[%s]]) #>> '%s') END)`,
			column, column, pgPath, column, pgJSONPBPath(pgPath),
		)
	case dialect.IsMySQL():
		return fmt.Sprintf(
			`(CASE WHEN JSON_VALID([[%s]]) THEN JSON_UNQUOTE(JSON_EXTRACT([[%s]], '$%s')) ELSE JSON_UNQUOTE(JSON_EXTRACT(JSON_OBJECT('pb', [[%s]]), '$.pb%s')) END)`,
			column, column, path, column, path,
		)
	default:
		return fmt.Sprintf(
			// note: the extra object wrapping is needed to workaround the cases where a json_extract is used with non-json columns.
			"(CASE WHEN json_valid([[%s]]) THEN JSON_EXTRACT([[%s]], '$%s') ELSE JSON_EXTRACT(json_object('pb', [[%s]]), '$.pb%s') END)",
			column,
			column,
			path,
			column,
			path,
		)
	}
}

// JSONNormalizeArrayFor converts a scalar/empty/non-json value into a JSON array expression.
func JSONNormalizeArrayFor(dialect Dialect, column string) string {
	switch {
	case dialect.IsPostgres():
		return fmt.Sprintf(
			`(CASE WHEN [[%s]] IS NULL OR [[%s]] = '' THEN '[]'::jsonb WHEN [[%s]] IS JSON AND jsonb_typeof([[%s]]::jsonb) = 'array' THEN [[%s]]::jsonb ELSE jsonb_build_array([[%s]]) END)::text`,
			column, column, column, column, column, column,
		)
	case dialect.IsMySQL():
		return fmt.Sprintf(
			`(CASE WHEN [[%s]] IS NULL OR [[%s]] = '' THEN '[]' WHEN JSON_VALID([[%s]]) AND JSON_TYPE([[%s]]) = 'ARRAY' THEN [[%s]] ELSE JSON_ARRAY([[%s]]) END)`,
			column, column, column, column, column, column,
		)
	default:
		return fmt.Sprintf(
			`(CASE WHEN COALESCE([[%s]], '') = '' THEN '[]' WHEN json_valid([[%s]]) AND json_type([[%s]]) = 'array' THEN [[%s]] ELSE json_array([[%s]]) END)`,
			column, column, column, column, column,
		)
	}
}

// JSONLastElementFor returns the last element of a JSON array as text, or an empty string.
func JSONLastElementFor(dialect Dialect, column string) string {
	switch {
	case dialect.IsPostgres():
		return fmt.Sprintf(
			`(CASE WHEN [[%s]] IS JSON AND jsonb_typeof([[%s]]::jsonb) = 'array' AND jsonb_array_length([[%s]]::jsonb) > 0 THEN (([[%s]])::jsonb -> -1) #>> '{}' ELSE '' END)`,
			column, column, column, column,
		)
	case dialect.IsMySQL():
		return fmt.Sprintf(
			`(CASE WHEN JSON_VALID([[%s]]) AND JSON_TYPE([[%s]]) = 'ARRAY' AND JSON_LENGTH([[%s]]) > 0 THEN JSON_UNQUOTE(JSON_EXTRACT([[%s]], CONCAT('$[', JSON_LENGTH([[%s]]) - 1, ']'))) ELSE '' END)`,
			column, column, column, column, column,
		)
	default:
		return fmt.Sprintf(
			`(CASE WHEN json_valid([[%s]]) AND json_type([[%s]]) = 'array' THEN COALESCE(json_extract([[%s]], '$[#-1]'), '') ELSE [[%s]] END)`,
			column, column, column, column,
		)
	}
}

func pgJSONPBPath(path string) string {
	path = strings.TrimPrefix(path, "{")
	path = strings.TrimSuffix(path, "}")
	if path == "" {
		return "{pb}"
	}
	return "{pb," + path + "}"
}

// pgJSONPath converts a SQLite style "$.foo[0]" path into a PostgreSQL path literal.
func pgJSONPath(path string) string {
	path = strings.TrimPrefix(path, "$")
	path = strings.TrimPrefix(path, ".")
	path = strings.ReplaceAll(path, "[", ".")
	path = strings.ReplaceAll(path, "]", "")
	path = strings.Trim(path, ".")
	if path == "" {
		return "{}"
	}

	parts := strings.Split(path, ".")
	for i, part := range parts {
		part = strings.ReplaceAll(part, `\`, `\\`)
		part = strings.ReplaceAll(part, `"`, `\"`)
		parts[i] = part
	}

	return "{" + strings.Join(parts, ",") + "}"
}
