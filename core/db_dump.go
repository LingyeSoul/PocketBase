package core

import (
	"context"
	"fmt"
	"net"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	mysqlDriver "github.com/go-sql-driver/mysql"
	"github.com/lingyesoul/pocketbase/tools/dbutils"
)

func databaseDumpFilename(dialect dbutils.Dialect, auxiliary bool) string {
	prefix := "data"
	if auxiliary {
		prefix = "auxiliary"
	}

	if dialect.IsPostgres() {
		return prefix + ".pgdump"
	}

	return prefix + ".sql"
}

func dumpExternalDB(dialect dbutils.Dialect, dsn string, outputPath string) error {
	if dsn == "" {
		return fmt.Errorf("missing database DSN for %s backup", dialect)
	}

	switch dialect {
	case dbutils.DialectPostgres:
		args, env, err := pgDumpArgs(dsn, outputPath)
		if err != nil {
			return err
		}
		return runDatabaseCommand("pg_dump", args, env)
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		args, env, err := mysqlDumpArgs(dsn, outputPath)
		if err != nil {
			return err
		}
		return runMySQLDump(args, env)
	default:
		return fmt.Errorf("database dump is not supported for dialect %q", dialect)
	}
}

func restoreExternalDB(dialect dbutils.Dialect, dsn string, inputPath string) error {
	if dsn == "" {
		return fmt.Errorf("missing database DSN for %s restore", dialect)
	}

	switch dialect {
	case dbutils.DialectPostgres:
		args, env, err := pgRestoreArgs(dsn, inputPath)
		if err != nil {
			return err
		}
		return runDatabaseCommand("pg_restore", args, env)
	case dbutils.DialectMySQL, dbutils.DialectMariaDB:
		args, env, err := mysqlRestoreArgs(dsn, inputPath)
		if err != nil {
			return err
		}
		if _, lookupErr := exec.LookPath("mysql"); lookupErr == nil {
			return runDatabaseCommandWithStdin("mysql", args, env, inputPath)
		}
		return runDatabaseCommandWithStdin("mariadb", args, env, inputPath)
	default:
		return fmt.Errorf("database restore is not supported for dialect %q", dialect)
	}
}

func pgDumpArgs(dsn string, outputPath string) ([]string, []string, error) {
	cleanDSN, env, err := pgDSNAndPassword(dsn)
	if err != nil {
		return nil, nil, err
	}

	return []string{
		"--dbname=" + cleanDSN,
		"--format=custom",
		"--no-owner",
		"--no-privileges",
		"--file=" + outputPath,
	}, env, nil
}

func pgRestoreArgs(dsn string, inputPath string) ([]string, []string, error) {
	cleanDSN, env, err := pgDSNAndPassword(dsn)
	if err != nil {
		return nil, nil, err
	}

	return []string{
		"--dbname=" + cleanDSN,
		"--clean",
		"--if-exists",
		"--no-owner",
		"--no-privileges",
		"--single-transaction",
		inputPath,
	}, env, nil
}

func pgDSNAndPassword(dsn string) (string, []string, error) {
	parsed, err := url.Parse(dsn)
	if err != nil {
		return "", nil, fmt.Errorf("invalid postgres DSN: %w", err)
	}

	env := os.Environ()
	if parsed.User != nil {
		if password, ok := parsed.User.Password(); ok && password != "" {
			env = append(env, "PGPASSWORD="+password)
			parsed.User = url.User(parsed.User.Username())
		}
	}

	return parsed.String(), env, nil
}

func mysqlDumpArgs(dsn string, outputPath string) ([]string, []string, error) {
	config, err := mysqlDriver.ParseDSN(dsn)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid mysql DSN: %w", err)
	}
	if config.DBName == "" {
		return nil, nil, fmt.Errorf("mysql DSN must include a database name")
	}

	args := []string{
		"--single-transaction",
		"--skip-lock-tables",
		"--skip-comments",
		"--result-file=" + outputPath,
	}
	args = append(args, mysqlConnectionArgs(config)...)
	args = append(args, "--databases", config.DBName)

	env := os.Environ()
	if config.Passwd != "" {
		env = append(env, "MYSQL_PWD="+config.Passwd)
	}

	return args, env, nil
}

func mysqlRestoreArgs(dsn string, inputPath string) ([]string, []string, error) {
	config, err := mysqlDriver.ParseDSN(dsn)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid mysql DSN: %w", err)
	}

	args := mysqlConnectionArgs(config)
	args = append(args, "--database", config.DBName)

	env := os.Environ()
	if config.Passwd != "" {
		env = append(env, "MYSQL_PWD="+config.Passwd)
	}

	return args, env, nil
}

func mysqlConnectionArgs(config *mysqlDriver.Config) []string {
	args := []string{"--default-character-set=utf8mb4"}
	if config.User != "" {
		args = append(args, "--user="+config.User)
	}

	if strings.HasPrefix(config.Net, "unix") {
		args = append(args, "--socket="+config.Addr)
		return args
	}

	host, port, err := net.SplitHostPort(config.Addr)
	if err == nil {
		if host != "" {
			args = append(args, "--host="+host)
		}
		if port != "" {
			args = append(args, "--port="+port)
		}
	}

	return args
}

func runMySQLDump(args []string, env []string) error {
	if _, err := exec.LookPath("mysqldump"); err == nil {
		return runDatabaseCommand("mysqldump", args, env)
	}

	return runDatabaseCommand("mariadb-dump", args, env)
}

func runDatabaseCommand(name string, args []string, env []string) error {
	command := exec.CommandContext(context.Background(), name, args...)
	command.Env = env

	output, err := command.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to run %s: %w (%s)", name, err, strings.TrimSpace(string(output)))
	}

	return nil
}

func runDatabaseCommandWithStdin(name string, args []string, env []string, inputPath string) error {
	input, err := os.Open(inputPath)
	if err != nil {
		return fmt.Errorf("failed to open database dump %q: %w", inputPath, err)
	}
	defer input.Close()

	command := exec.CommandContext(context.Background(), name, args...)
	command.Env = env
	command.Stdin = input

	output, err := command.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to run %s: %w (%s)", name, err, strings.TrimSpace(string(output)))
	}

	return nil
}

func dumpFilePath(dir string, dialect dbutils.Dialect, auxiliary bool) string {
	return filepath.Join(dir, databaseDumpFilename(dialect, auxiliary))
}

// DataDBDSN returns the configured main database connection string.
func (app *BaseApp) DataDBDSN() string {
	return app.config.DBDSN
}

// AuxDBDSN returns the configured auxiliary database connection string.
func (app *BaseApp) AuxDBDSN() string {
	if app.config.AuxDBDSN != "" {
		return app.config.AuxDBDSN
	}

	return app.config.DBDSN
}

func externalDBDSN(app App, auxiliary bool) (string, error) {
	provider, ok := app.(interface {
		DataDBDSN() string
		AuxDBDSN() string
	})
	if !ok {
		return "", fmt.Errorf("external database backups require a BaseApp with a configured DSN")
	}

	dsn := provider.DataDBDSN()
	if auxiliary {
		dsn = provider.AuxDBDSN()
	}
	if dsn == "" {
		return "", fmt.Errorf("missing database DSN for external database backup")
	}

	return dsn, nil
}
