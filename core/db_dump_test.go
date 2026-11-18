package core

import (
	"os"
	"path/filepath"
	"testing"

	"ganigeorgiev.com/pocketbase/dbx"
	"github.com/lingyesoul/pocketbase/tools/dbutils"
)

func TestExternalDatabaseDumpRestore(t *testing.T) {
	driver := os.Getenv("PB_TEST_DB_DRIVER")
	dsn := os.Getenv("PB_TEST_DB_DSN")
	if driver == "" || dsn == "" {
		t.Skip("PB_TEST_DB_DRIVER and PB_TEST_DB_DSN are not set")
	}

	dialect, err := dbutils.NormalizeDialect(driver)
	if err != nil || dialect.IsSQLite() {
		t.Skip("test requires a non-sqlite database")
	}

	db, err := openConfiguredDB(driver, dsn, "")
	if err != nil {
		t.Fatalf("open database failed: %v", err)
	}
	defer db.Close()

	if _, err := db.NewQuery("DROP TABLE IF EXISTS dump_restore_test").Execute(); err != nil {
		t.Fatalf("drop test table failed: %v", err)
	}
	if _, err := db.NewQuery("CREATE TABLE dump_restore_test (id VARCHAR(64) PRIMARY KEY NOT NULL, title VARCHAR(255) DEFAULT '' NOT NULL)").Execute(); err != nil {
		t.Fatalf("create test table failed: %v", err)
	}
	if _, err := db.NewQuery("INSERT INTO dump_restore_test (id, title) VALUES ({:id}, {:title})").Bind(dbx.Params{
		"id":    "test-id",
		"title": "test-title",
	}).Execute(); err != nil {
		t.Fatalf("insert test row failed: %v", err)
	}

	dumpPath := filepath.Join(t.TempDir(), databaseDumpFilename(dialect, false))
	if err := dumpExternalDB(dialect, dsn, dumpPath); err != nil {
		t.Fatalf("dump failed: %v", err)
	}

	if _, err := db.NewQuery("DROP TABLE dump_restore_test").Execute(); err != nil {
		t.Fatalf("drop test table before restore failed: %v", err)
	}

	if err := restoreExternalDB(dialect, dsn, dumpPath); err != nil {
		t.Fatalf("restore failed: %v", err)
	}

	var title string
	if err := db.NewQuery("SELECT title FROM dump_restore_test WHERE id = {:id}").
		Bind(dbx.Params{"id": "test-id"}).
		Row(&title); err != nil {
		t.Fatalf("select restored row failed: %v", err)
	}
	if title != "test-title" {
		t.Fatalf("unexpected restored title %q", title)
	}
}
