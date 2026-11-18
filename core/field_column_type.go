package core

import (
	"fmt"
	"strings"

	"github.com/lingyesoul/pocketbase/tools/dbutils"
)

func sqlStringLiteral(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "''") + "'"
}

func appPrimaryKeyColumnType(app App) string {
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		return "TEXT PRIMARY KEY NOT NULL"
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		return "VARCHAR(255) PRIMARY KEY NOT NULL"
	default:
		// note: the default is a last resort fallback to avoid empty
		// string values in case a record was inserted with raw SQL.
		return "TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL"
	}
}

func appIndexedTextColumnType(app App, maxLen int) string {
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		return "TEXT DEFAULT '' NOT NULL"
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		size := maxLen
		if size <= 0 || size > 768 {
			size = 768
		}
		return fmt.Sprintf("VARCHAR(%d) DEFAULT '' NOT NULL", size)
	default:
		return "TEXT DEFAULT '' NOT NULL"
	}
}

func appLongTextColumnType(app App, notNull bool) string {
	nullability := " NULL"
	defaultValue := " DEFAULT NULL"
	if notNull {
		nullability = " NOT NULL"
		defaultValue = " DEFAULT " + sqlStringLiteral("")
	}

	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		return "TEXT" + defaultValue + nullability
	case dbutils.DialectMySQL:
		return "LONGTEXT DEFAULT ('')" + nullability
	case dbutils.DialectMariaDB:
		return "LONGTEXT" + defaultValue + nullability
	default:
		return "TEXT" + defaultValue + nullability
	}
}

func appJSONColumnType(app App, defaultValue string, notNull bool) string {
	if defaultValue == "" {
		switch app.DBDialect() {
		case dbutils.DialectMySQL:
			return "LONGTEXT DEFAULT NULL"
		case dbutils.DialectMariaDB:
			return "LONGTEXT DEFAULT NULL"
		case dbutils.DialectPostgres:
			return "TEXT DEFAULT NULL"
		default:
			return "JSON DEFAULT NULL"
		}
	}

	quoted := sqlStringLiteral(defaultValue)
	if notNull {
		switch app.DBDialect() {
		case dbutils.DialectMySQL:
			return "LONGTEXT DEFAULT (" + quoted + ") NOT NULL"
		case dbutils.DialectMariaDB:
			return "LONGTEXT DEFAULT " + quoted + " NOT NULL"
		case dbutils.DialectPostgres:
			return "TEXT DEFAULT " + quoted + " NOT NULL"
		default:
			return "JSON DEFAULT " + quoted + " NOT NULL"
		}
	}

	return "TEXT DEFAULT " + quoted
}

func appBoolColumnType(app App) string {
	return "BOOLEAN DEFAULT FALSE NOT NULL"
}

func appNumberColumnType(app App) string {
	switch app.DBDialect() {
	case dbutils.DialectPostgres:
		return "DOUBLE PRECISION DEFAULT 0 NOT NULL"
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		return "DOUBLE DEFAULT 0 NOT NULL"
	default:
		return "NUMERIC DEFAULT 0 NOT NULL"
	}
}

func appDateColumnType(app App) string {
	switch app.DBDialect() {
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		return "VARCHAR(64) DEFAULT '' NOT NULL"
	default:
		return "TEXT DEFAULT '' NOT NULL"
	}
}
