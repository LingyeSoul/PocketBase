package core

import (
	"fmt"

	"github.com/lingyesoul/pocketbase/tools/dbutils"
)

func createCollectionIndex(app App, parsed dbutils.Index) error {
	if app.DBDialect().IsMariaDB() {
		if column, ok := parsed.PartialUniqueColumn(); ok {
			if err := ensureMariaDBGeneratedIndexColumn(app, parsed.TableName, parsed.PartialUniqueColumnName(), column); err != nil {
				return err
			}
		}
	}

	sql, err := parsed.BuildFor(app.DBDialect())
	if err != nil {
		return err
	}
	if sql == "" {
		return fmt.Errorf("invalid index expression for %q", parsed.IndexName)
	}

	_, err = app.DB().NewQuery(sql).Execute()
	return err
}

func dropCollectionIndex(app App, tableName string, parsed dbutils.Index) error {
	if app.DBDialect().IsMariaDB() {
		if _, ok := parsed.PartialUniqueColumn(); ok {
			_, err := app.DB().NewQuery(fmt.Sprintf(
				"DROP INDEX IF EXISTS %s ON %s",
				app.DBDialect().QuoteIdentifier(parsed.IndexName),
				app.DBDialect().QuoteIdentifier(tableName),
			)).Execute()
			if err != nil {
				return fmt.Errorf("failed to drop index %s: %w", parsed.IndexName, err)
			}

			hidden := parsed.PartialUniqueColumnName()
			_, err = app.DB().NewQuery(fmt.Sprintf(
				"ALTER TABLE %s DROP COLUMN IF EXISTS %s",
				app.DBDialect().QuoteIdentifier(tableName),
				app.DBDialect().QuoteIdentifier(hidden),
			)).Execute()
			if err != nil {
				return fmt.Errorf("failed to drop generated column %s: %w", hidden, err)
			}

			return nil
		}
	}

	_, err := app.DB().DropIndex(tableName, parsed.IndexName).Execute()
	return err
}

func ensureMariaDBGeneratedIndexColumn(app App, tableName string, columnName string, sourceColumn string) error {
	_, err := app.DB().NewQuery(fmt.Sprintf(
		"ALTER TABLE %s ADD COLUMN IF NOT EXISTS %s VARCHAR(255) AS (NULLIF(%s, '')) STORED INVISIBLE",
		app.DBDialect().QuoteIdentifier(tableName),
		app.DBDialect().QuoteIdentifier(columnName),
		app.DBDialect().QuoteIdentifier(sourceColumn),
	)).Execute()
	if err != nil {
		return fmt.Errorf("failed to create generated column %s: %w", columnName, err)
	}

	return nil
}

func renameColumn(app App, table string, oldName string, newName string) error {
	if app.DBDialect().IsMySQL() {
		_, err := app.DB().NewQuery(fmt.Sprintf(
			"ALTER TABLE %s RENAME COLUMN %s TO %s",
			app.DBDialect().QuoteIdentifier(table),
			app.DBDialect().QuoteIdentifier(oldName),
			app.DBDialect().QuoteIdentifier(newName),
		)).Execute()
		return err
	}

	_, err := app.DB().RenameColumn(table, oldName, newName).Execute()
	return err
}
