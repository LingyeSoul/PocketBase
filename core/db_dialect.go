package core

import (
	"fmt"

	"ganigeorgiev.com/pocketbase/dbx"
	"github.com/lingyesoul/pocketbase/tools/dbutils"
)

// DBDialect returns the SQL dialect used by the active database connection.
func (app *BaseApp) DBDialect() dbutils.Dialect {
	if app.dialect != "" {
		return app.dialect
	}

	return dbutils.DialectSQLite
}

func (app *BaseApp) connectDataDB(dbPath string) (*dbx.DB, error) {
	if app.config.DBConnect != nil {
		return app.config.DBConnect(dbPath)
	}

	return openConfiguredDB(app.config.DBDriver, app.config.DBDSN, dbPath)
}

func (app *BaseApp) connectAuxDB(dbPath string) (*dbx.DB, error) {
	if app.config.AuxDBConnect != nil {
		return app.config.AuxDBConnect(dbPath)
	}
	if app.config.DBConnect != nil {
		return app.config.DBConnect(dbPath)
	}

	dsn := app.config.AuxDBDSN
	if dsn == "" {
		dsn = app.config.DBDSN
	}

	return openConfiguredDB(app.config.DBDriver, dsn, dbPath)
}

func (app *BaseApp) resolveDialect(db *dbx.DB) dbutils.Dialect {
	configured, err := dbutils.NormalizeDialect(app.config.DBDriver)
	if err != nil {
		return dbutils.DialectSQLite
	}

	if configured != dbutils.DialectSQLite {
		return configured
	}

	if db == nil {
		return dbutils.DialectSQLite
	}

	return dbutils.DialectFromDriver(db.DriverName())
}

func openConfiguredDB(driverName string, dsn string, dbPath string) (*dbx.DB, error) {
	dialect, err := dbutils.NormalizeDialect(driverName)
	if err != nil {
		return nil, err
	}

	if dialect.IsSQLite() {
		return DefaultDBConnect(dbPath)
	}

	if dsn == "" {
		return nil, fmt.Errorf("missing database DSN for dialect %q", dialect)
	}

	switch dialect {
	case dbutils.DialectPostgres:
		return dbx.Open("pgx", dsn)
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		return dbx.Open("mysql", dsn)
	default:
		return nil, fmt.Errorf("unsupported database dialect %q", dialect)
	}
}
