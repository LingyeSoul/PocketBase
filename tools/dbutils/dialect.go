package dbutils

import (
	"fmt"
	"strings"
)

// Dialect identifies the SQL dialect used by the active database connection.
type Dialect string

const (
	DialectSQLite   Dialect = "sqlite"
	DialectPostgres Dialect = "postgres"
	DialectMySQL    Dialect = "mysql"
	DialectMariaDB  Dialect = "mariadb"
)

// DialectFromDriver maps a database/sql driver name to a Dialect.
func DialectFromDriver(driver string) Dialect {
	switch strings.ToLower(strings.TrimSpace(driver)) {
	case "postgres", "postgresql", "pgx":
		return DialectPostgres
	case "mysql":
		return DialectMySQL
	case "mariadb":
		return DialectMariaDB
	default:
		return DialectSQLite
	}
}

// NormalizeDialect validates and normalizes a user provided dialect name.
func NormalizeDialect(name string) (Dialect, error) {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "", "sqlite", "sqlite3":
		return DialectSQLite, nil
	case "postgres", "postgresql", "pgsql", "pgx":
		return DialectPostgres, nil
	case "mysql":
		return DialectMySQL, nil
	case "mariadb":
		return DialectMariaDB, nil
	default:
		return "", fmt.Errorf("unsupported database dialect %q (expected sqlite, postgres, mysql or mariadb)", name)
	}
}

// IsSQLite reports whether the dialect uses the embedded SQLite engine.
func (d Dialect) IsSQLite() bool {
	return d == DialectSQLite
}

// IsPostgres reports whether the dialect is PostgreSQL.
func (d Dialect) IsPostgres() bool {
	return d == DialectPostgres
}

// IsMySQL reports whether the dialect uses the MySQL protocol (MySQL or MariaDB).
func (d Dialect) IsMySQL() bool {
	return d == DialectMySQL || d == DialectMariaDB
}

// IsMariaDB reports whether the dialect is MariaDB.
func (d Dialect) IsMariaDB() bool {
	return d == DialectMariaDB
}

// QuoteIdentifier quotes a single identifier for the dialect.
func (d Dialect) QuoteIdentifier(identifier string) string {
	if d.IsPostgres() {
		return `"` + strings.ReplaceAll(identifier, `"`, `""`) + `"`
	}

	return "`" + strings.ReplaceAll(identifier, "`", "``") + "`"
}

// CreateTableOptions returns extra CREATE TABLE suffixes required by the dialect.
func (d Dialect) CreateTableOptions() []string {
	switch d {
	case DialectMySQL:
		return []string{"ENGINE=InnoDB", "DEFAULT CHARSET=utf8mb4", "COLLATE=utf8mb4_0900_ai_ci"}
	case DialectMariaDB:
		return []string{"ENGINE=InnoDB", "DEFAULT CHARSET=utf8mb4", "COLLATE=utf8mb4_general_ci"}
	default:
		return nil
	}
}

// CaseInsensitiveCollation returns the explicit case-insensitive collation for the dialect.
func (d Dialect) CaseInsensitiveCollation() string {
	switch d {
	case DialectMySQL:
		return "utf8mb4_0900_ai_ci"
	case DialectMariaDB:
		return "utf8mb4_general_ci"
	default:
		return ""
	}
}
