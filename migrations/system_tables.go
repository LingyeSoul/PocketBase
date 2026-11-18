package migrations

import (
	"fmt"
	"strings"

	"github.com/lingyesoul/pocketbase/core"
)

func portableSQLString(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "''") + "'"
}

func portablePrimaryKey(app core.App) string {
	if app.DBDialect().IsPostgres() {
		return "TEXT PRIMARY KEY NOT NULL"
	}

	return "VARCHAR(255) PRIMARY KEY NOT NULL"
}

func portableText(app core.App, maxLen int) string {
	if app.DBDialect().IsPostgres() {
		return "TEXT DEFAULT '' NOT NULL"
	}

	if maxLen <= 0 || maxLen > 768 {
		maxLen = 768
	}

	return fmt.Sprintf("VARCHAR(%d) DEFAULT '' NOT NULL", maxLen)
}

func portableTextDefault(app core.App, maxLen int, defaultValue string) string {
	if app.DBDialect().IsPostgres() {
		return "TEXT DEFAULT " + portableSQLString(defaultValue) + " NOT NULL"
	}

	if maxLen <= 0 || maxLen > 768 {
		maxLen = 768
	}

	return fmt.Sprintf("VARCHAR(%d) DEFAULT %s NOT NULL", maxLen, portableSQLString(defaultValue))
}

func portableLongText(app core.App, notNull bool) string {
	if app.DBDialect().IsPostgres() {
		if notNull {
			return "TEXT DEFAULT '' NOT NULL"
		}
		return "TEXT DEFAULT NULL"
	}

	if app.DBDialect().IsMySQL() {
		if notNull {
			return "LONGTEXT DEFAULT ('') NOT NULL"
		}
		return "LONGTEXT DEFAULT NULL"
	}

	if notNull {
		return "TEXT DEFAULT '' NOT NULL"
	}
	return "TEXT DEFAULT NULL"
}

func portableNullableText(app core.App) string {
	if app.DBDialect().IsPostgres() {
		return "TEXT DEFAULT NULL"
	}

	return "LONGTEXT DEFAULT NULL"
}

func portableJSON(app core.App, defaultValue string, notNull bool) string {
	if defaultValue == "" {
		if app.DBDialect().IsPostgres() {
			return "TEXT DEFAULT NULL"
		}
		return "LONGTEXT DEFAULT NULL"
	}

	quoted := portableSQLString(defaultValue)
	if app.DBDialect().IsPostgres() {
		if notNull {
			return "TEXT DEFAULT " + quoted + " NOT NULL"
		}
		return "TEXT DEFAULT " + quoted
	}

	if app.DBDialect().IsMySQL() {
		if notNull {
			return "LONGTEXT DEFAULT (" + quoted + ") NOT NULL"
		}
		return "LONGTEXT DEFAULT (" + quoted + ")"
	}

	if notNull {
		return "LONGTEXT DEFAULT " + quoted + " NOT NULL"
	}
	return "LONGTEXT DEFAULT " + quoted
}

func portableDate(app core.App) string {
	if app.DBDialect().IsPostgres() {
		return "TEXT DEFAULT '' NOT NULL"
	}

	return "VARCHAR(64) DEFAULT '' NOT NULL"
}

func portableInt(app core.App) string {
	if app.DBDialect().IsPostgres() {
		return "INTEGER DEFAULT 0 NOT NULL"
	}

	return "INT DEFAULT 0 NOT NULL"
}

func createPortableParamsTable(app core.App) error {
	cols := map[string]string{
		"id":      portablePrimaryKey(app),
		"value":   portableJSON(app, "", false),
		"created": portableDate(app),
		"updated": portableDate(app),
	}

	_, err := app.DB().CreateTable("_params", cols, app.DBDialect().CreateTableOptions()...).Execute()
	return err
}

func createPortableCollectionsTable(app core.App) error {
	cols := map[string]string{
		"id":         portablePrimaryKey(app),
		"system":     "BOOLEAN DEFAULT FALSE NOT NULL",
		"type":       portableTextDefault(app, 255, "base"),
		"name":       portableText(app, 255) + " UNIQUE",
		"fields":     portableJSON(app, "[]", true),
		"indexes":    portableJSON(app, "[]", true),
		"listRule":   portableNullableText(app),
		"viewRule":   portableNullableText(app),
		"createRule": portableNullableText(app),
		"updateRule": portableNullableText(app),
		"deleteRule": portableNullableText(app),
		"options":    portableJSON(app, "{}", true),
		"created":    portableDate(app),
		"updated":    portableDate(app),
	}

	_, err := app.DB().CreateTable("_collections", cols, app.DBDialect().CreateTableOptions()...).Execute()
	if err != nil {
		return err
	}

	_, err = app.DB().CreateIndex("_collections", "idx__collections_type", "type").Execute()
	if err != nil {
		return err
	}

	return nil
}

func createPortableLogsTable(app core.App) error {
	cols := map[string]string{
		"id":      portablePrimaryKey(app),
		"level":   portableInt(app),
		"message": portableLongText(app, true),
		"data":    portableJSON(app, "{}", true),
		"created": portableDate(app),
	}

	_, err := app.AuxDB().CreateTable("_logs", cols, app.DBDialect().CreateTableOptions()...).Execute()
	if err != nil {
		return err
	}

	if _, err := app.AuxDB().CreateIndex("_logs", "idx_logs_level", "level").Execute(); err != nil {
		return err
	}

	if !app.DBDialect().IsMySQL() {
		if _, err := app.AuxDB().CreateIndex("_logs", "idx_logs_message", "message").Execute(); err != nil {
			return err
		}
	}

	_, err = app.AuxDB().CreateIndex("_logs", "idx_logs_created", "created").Execute()
	return err
}
