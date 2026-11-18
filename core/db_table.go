package core

import (
	"database/sql"
	"fmt"
	"strings"

	"ganigeorgiev.com/pocketbase/dbx"
	"github.com/lingyesoul/pocketbase/tools/dbutils"
)

// TableColumns returns all column names of a single table by its name.
func (app *BaseApp) TableColumns(tableName string) ([]string, error) {
	info, err := app.TableInfo(tableName)
	if err != nil {
		return nil, err
	}

	columns := make([]string, 0, len(info))
	for _, row := range info {
		columns = append(columns, row.Name)
	}

	return columns, nil
}

type TableInfoRow struct {
	// the `db:"pk"` tag has special semantic so we cannot rename
	// the original field without specifying a custom mapper
	PK int

	Index        int            `db:"cid"`
	Name         string         `db:"name"`
	Type         string         `db:"type"`
	NotNull      bool           `db:"notnull"`
	DefaultValue sql.NullString `db:"dflt_value"`
}

// TableInfo returns the table_info pragma result for the specified table.
func (app *BaseApp) TableInfo(tableName string) ([]*TableInfoRow, error) {
	info := []*TableInfoRow{}

	var err error
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		err = app.ConcurrentDB().NewQuery(`
			SELECT
				c.ordinal_position - 1 AS cid,
				c.column_name AS name,
				c.data_type AS type,
				(c.is_nullable = 'NO') AS notnull,
				c.column_default AS dflt_value,
				CASE WHEN EXISTS (
					SELECT 1
					FROM information_schema.table_constraints tc
					JOIN information_schema.key_column_usage kcu
						ON tc.constraint_name = kcu.constraint_name
						AND tc.table_schema = kcu.table_schema
					WHERE tc.constraint_type = 'PRIMARY KEY'
						AND tc.table_schema = c.table_schema
						AND tc.table_name = c.table_name
						AND kcu.column_name = c.column_name
				) THEN 1 ELSE 0 END AS pk
			FROM information_schema.columns c
			WHERE c.table_schema = current_schema() AND c.table_name = {:tableName}
			ORDER BY c.ordinal_position
		`).Bind(dbx.Params{"tableName": tableName}).All(&info)
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		err = app.ConcurrentDB().NewQuery(`
			SELECT
				ordinal_position - 1 AS cid,
				column_name AS name,
				column_type AS type,
				(is_nullable = 'NO') AS notnull,
				column_default AS dflt_value,
				(column_key = 'PRI') AS pk
			FROM information_schema.columns
			WHERE table_schema = DATABASE() AND table_name = {:tableName}
			ORDER BY ordinal_position
		`).Bind(dbx.Params{"tableName": tableName}).All(&info)
	default:
		err = app.ConcurrentDB().NewQuery("SELECT * FROM PRAGMA_TABLE_INFO({:tableName})").
			Bind(dbx.Params{"tableName": tableName}).
			All(&info)
	}
	if err != nil {
		return nil, err
	}

	// mattn/go-sqlite3 doesn't throw an error on invalid or missing table
	// so we additionally have to check whether the loaded info result is nonempty
	if len(info) == 0 {
		return nil, fmt.Errorf("empty table info probably due to invalid or missing table %s", tableName)
	}

	return info, nil
}

// TableIndexes returns a name grouped map with all non empty index of the specified table.
//
// Note: This method doesn't return an error on nonexisting table.
func (app *BaseApp) TableIndexes(tableName string) (map[string]string, error) {
	indexes := []struct {
		Name string `db:"name"`
		Sql  string `db:"sql"`
	}{}

	var err error
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		err = app.ConcurrentDB().
			Select("indexname AS name", "indexdef AS sql").
			From("pg_indexes").
			AndWhere(dbx.NewExp("schemaname = current_schema()")).
			AndWhere(dbx.HashExp{"tablename": tableName}).
			All(&indexes)
		if err != nil {
			return nil, err
		}
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		rows := []struct {
			Name       string `db:"name"`
			NonUnique  int    `db:"non_unique"`
			ColumnName string `db:"column_name"`
			Seq        int    `db:"seq_in_index"`
		}{}
		err = app.ConcurrentDB().NewQuery(`
			SELECT
				index_name AS name,
				non_unique AS non_unique,
				COALESCE(column_name, '') AS column_name,
				seq_in_index AS seq_in_index
			FROM information_schema.statistics
			WHERE table_schema = DATABASE() AND table_name = {:tableName}
			ORDER BY index_name, seq_in_index
		`).Bind(dbx.Params{"tableName": tableName}).All(&rows)
		if err != nil {
			return nil, err
		}

		grouped := map[string][]string{}
		unique := map[string]bool{}
		for _, row := range rows {
			if strings.EqualFold(row.Name, "PRIMARY") {
				continue
			}
			column := row.ColumnName
			if column == "" {
				continue
			}
			grouped[row.Name] = append(grouped[row.Name], app.DBDialect().QuoteIdentifier(column))
			unique[row.Name] = row.NonUnique == 0
		}

		for name, columns := range grouped {
			prefix := "CREATE INDEX "
			if unique[name] {
				prefix = "CREATE UNIQUE INDEX "
			}
			indexes = append(indexes, struct {
				Name string `db:"name"`
				Sql  string `db:"sql"`
			}{
				Name: name,
				Sql: prefix + app.DBDialect().QuoteIdentifier(name) + " ON " +
					app.DBDialect().QuoteIdentifier(tableName) + " (" + strings.Join(columns, ", ") + ")",
			})
		}
	default:
		err = app.ConcurrentDB().Select("name", "sql").
			From("sqlite_master").
			AndWhere(dbx.NewExp("sql is not null")).
			AndWhere(dbx.HashExp{
				"type":     "index",
				"tbl_name": tableName,
			}).
			All(&indexes)
		if err != nil {
			return nil, err
		}
	}

	result := make(map[string]string, len(indexes))
	for _, idx := range indexes {
		result[idx.Name] = idx.Sql
	}

	return result, nil
}

// DeleteTable drops the specified table.
//
// This method is a no-op if a table with the provided name doesn't exist.
//
// NB! Be aware that this method is vulnerable to SQL injection and the
// "dangerousTableName" argument must come only from trusted input!
func (app *BaseApp) DeleteTable(dangerousTableName string) error {
	_, err := app.NonconcurrentDB().NewQuery(fmt.Sprintf(
		"DROP TABLE IF EXISTS {{%s}}",
		dangerousTableName,
	)).Execute()

	return err
}

// HasTable checks if a table (or view) with the provided name exists (case insensitive).
// in the data.db.
func (app *BaseApp) HasTable(tableName string) bool {
	return app.hasTable(app.ConcurrentDB(), tableName)
}

// AuxHasTable checks if a table (or view) with the provided name exists (case insensitive)
// in the auixiliary.db.
func (app *BaseApp) AuxHasTable(tableName string) bool {
	return app.hasTable(app.AuxConcurrentDB(), tableName)
}

func (app *BaseApp) hasTable(db dbx.Builder, tableName string) bool {
	var exists int

	var err error
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		err = db.Select("(1)").
			From("information_schema.tables").
			AndWhere(dbx.NewExp("table_schema = current_schema()")).
			AndWhere(dbx.NewExp("LOWER(table_name)=LOWER({:tableName})", dbx.Params{"tableName": tableName})).
			Limit(1).
			Row(&exists)
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		err = db.Select("(1)").
			From("information_schema.tables").
			AndWhere(dbx.NewExp("table_schema = DATABASE()")).
			AndWhere(dbx.NewExp("LOWER(table_name)=LOWER({:tableName})", dbx.Params{"tableName": tableName})).
			Limit(1).
			Row(&exists)
	default:
		err = db.Select("(1)").
			From("sqlite_schema").
			AndWhere(dbx.HashExp{"type": []any{"table", "view"}}).
			AndWhere(dbx.NewExp("LOWER([[name]])=LOWER({:tableName})", dbx.Params{"tableName": tableName})).
			Limit(1).
			Row(&exists)
	}

	return err == nil && exists > 0
}

// FindIndexTableName returns the table that owns an index with the provided name.
func (app *BaseApp) FindIndexTableName(indexName string) (string, error) {
	var tableName string

	var err error
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		err = app.ConcurrentDB().Select("tablename").
			From("pg_indexes").
			AndWhere(dbx.NewExp("schemaname = current_schema()")).
			AndWhere(dbx.NewExp("LOWER(indexname)=LOWER({:indexName})", dbx.Params{"indexName": indexName})).
			Limit(1).
			Row(&tableName)
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		err = app.ConcurrentDB().Select("table_name").
			From("information_schema.statistics").
			AndWhere(dbx.NewExp("table_schema = DATABASE()")).
			AndWhere(dbx.NewExp("LOWER(index_name)=LOWER({:indexName})", dbx.Params{"indexName": indexName})).
			Limit(1).
			Row(&tableName)
	default:
		err = app.ConcurrentDB().Select("tbl_name").
			From("sqlite_master").
			AndWhere(dbx.HashExp{"type": "index"}).
			AndWhere(dbx.NewExp("LOWER([[name]])=LOWER({:indexName})", dbx.Params{"indexName": indexName})).
			Limit(1).
			Row(&tableName)
	}

	return tableName, err
}

// ViewInfo describes a persistent database view.
type ViewInfo struct {
	Name string `db:"name"`
	SQL  string `db:"sql"`
}

// FindAllViews returns all persistent views with their create statement.
func (app *BaseApp) FindAllViews() ([]ViewInfo, error) {
	views := []ViewInfo{}

	var err error
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		err = app.ConcurrentDB().Select("viewname AS name", "definition AS sql").
			From("pg_views").
			AndWhere(dbx.NewExp("schemaname = current_schema()")).
			All(&views)
		for i := range views {
			views[i].SQL = "CREATE VIEW " + app.DBDialect().QuoteIdentifier(views[i].Name) + " AS " + views[i].SQL
		}
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		err = app.ConcurrentDB().Select("table_name AS name", "view_definition AS sql").
			From("information_schema.views").
			AndWhere(dbx.NewExp("table_schema = DATABASE()")).
			All(&views)
		for i := range views {
			views[i].SQL = "CREATE VIEW " + app.DBDialect().QuoteIdentifier(views[i].Name) + " AS " + views[i].SQL
		}
	default:
		err = app.ConcurrentDB().Select("name", "sql").
			From("sqlite_master").
			AndWhere(dbx.NewExp("sql is not null")).
			AndWhere(dbx.HashExp{"type": "view"}).
			All(&views)
	}

	return views, err
}

// Vacuum executes VACUUM on the data.db in order to reclaim unused data db disk space.
func (app *BaseApp) Vacuum() error {
	return app.vacuum(app.NonconcurrentDB())
}

// AuxVacuum executes VACUUM on the auxiliary.db in order to reclaim unused auxiliary db disk space.
func (app *BaseApp) AuxVacuum() error {
	return app.vacuum(app.AuxNonconcurrentDB())
}

func (app *BaseApp) vacuum(db dbx.Builder) error {
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		_, err := db.NewQuery("VACUUM").Execute()
		return err
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		return nil
	default:
		_, err := db.NewQuery("VACUUM").Execute()
		return err
	}
}
