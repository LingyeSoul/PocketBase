package tests

import (
	"archive/zip"
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/lingyesoul/pocketbase/core"
)

func TestMultiDBSmoke(t *testing.T) {
	driver := os.Getenv("PB_TEST_DB_DRIVER")
	dsn := os.Getenv("PB_TEST_DB_DSN")
	if driver == "" || dsn == "" {
		t.Skip("PB_TEST_DB_DRIVER and PB_TEST_DB_DSN are not set")
	}

	dataDir := t.TempDir()
	app := core.NewBaseApp(core.BaseAppConfig{
		DataDir:       dataDir,
		DBDriver:      driver,
		DBDSN:         dsn,
		AuxDBDSN:      dsn,
		EncryptionEnv: "pb_test_env",
		IsDev:         true,
	})
	t.Cleanup(func() {
		_ = app.ClearBootstrap()
	})

	if err := app.Bootstrap(); err != nil {
		t.Fatalf("bootstrap failed: %v", err)
	}

	collections, err := app.FindAllCollections()
	if err != nil {
		t.Fatalf("find collections failed: %v", err)
	}
	if len(collections) == 0 {
		t.Fatal("expected system collections to be created")
	}

	if existing, _ := app.FindCollectionByNameOrId("smoke_items"); existing != nil {
		_ = app.Delete(existing)
	}

	col := core.NewBaseCollection("smoke_items")
	col.Fields.Add(&core.TextField{Name: "title", Max: 100})
	col.Fields.Add(&core.JSONField{Name: "meta"})
	col.Fields.Add(&core.BoolField{Name: "active"})
	col.Fields.Add(&core.NumberField{Name: "score"})
	col.Fields.Add(&core.DateField{Name: "due"})
	col.AddIndex("idx_smoke_title", false, "title", "")

	if err := app.Save(col); err != nil {
		t.Fatalf("create collection failed: %v", err)
	}

	record := core.NewRecord(col)
	record.Set("title", "abc")
	record.Set("meta", map[string]any{"foo": "bar"})
	record.Set("active", true)
	record.Set("score", 5)
	record.Set("due", "2026-01-02 03:04:05.000Z")
	if err := app.Save(record); err != nil {
		t.Fatalf("create record failed: %v", err)
	}

	for _, filter := range []string{
		`title ~ 'ABC'`,
		`meta.foo = 'bar'`,
		`active = true`,
		`score > 1`,
		`due > '2025-01-01 00:00:00.000Z'`,
		`strftime('%Y-%m-%d', due) = '2026-01-02'`,
		`strftime('%Y-%m-%d', due, '+1 day') = '2026-01-03'`,
		`title ~ 'ABC' && meta.foo = 'bar' && active = true && score > 1`,
	} {
		found, err := app.FindFirstRecordByFilter("smoke_items", filter)
		if err != nil {
			t.Fatalf("filter %q failed: %v", filter, err)
		}
		if found.Id != record.Id {
			t.Fatalf("filter %q returned unexpected record id %q", filter, found.Id)
		}
	}

	if _, err := app.TableInfo("smoke_items"); err != nil {
		t.Fatalf("table info failed: %v", err)
	}
	if indexes, err := app.TableIndexes("smoke_items"); err != nil {
		t.Fatalf("table indexes failed: %v", err)
	} else if len(indexes) == 0 {
		t.Fatal("expected at least one index")
	}

	if _, err := app.LogsStats(nil); err != nil {
		t.Fatalf("logs stats failed: %v", err)
	}

	col.AddIndex("idx_smoke_title_unique", true, "title", "title != ''")
	if err := app.Save(col); err != nil {
		t.Fatalf("add partial unique index failed: %v", err)
	}

	view := core.NewViewCollection("smoke_view")
	view.ViewQuery = "SELECT id, title FROM smoke_items"
	if err := app.Save(view); err != nil {
		t.Fatalf("create view collection failed: %v", err)
	}
	if _, err := app.FindRecordsByFilter("smoke_view", "", "", 10, 0); err != nil {
		t.Fatalf("query view collection failed: %v", err)
	}

	emptyRecord := core.NewRecord(col)
	emptyRecord.Set("title", "")
	if err := app.Save(emptyRecord); err != nil {
		t.Fatalf("empty title record failed: %v", err)
	}

	duplicateRecord := core.NewRecord(col)
	duplicateRecord.Set("title", "abc")
	if err := app.Save(duplicateRecord); err == nil {
		t.Fatal("expected duplicate non-empty title to fail")
	}

	col.RemoveIndex("idx_smoke_title_unique")
	if err := app.Save(col); err != nil {
		t.Fatalf("remove partial unique index failed: %v", err)
	}

	tags := core.NewBaseCollection("smoke_tags")
	tags.Fields.Add(&core.TextField{Name: "name", Max: 100})
	if err := app.Save(tags); err != nil {
		t.Fatalf("create tags collection failed: %v", err)
	}

	col.Fields.Add(&core.RelationField{Name: "tags", CollectionId: tags.Id, MaxSelect: 3})
	if err := app.Save(col); err != nil {
		t.Fatalf("add relation field failed: %v", err)
	}

	tag := core.NewRecord(tags)
	tag.Set("name", "one")
	if err := app.Save(tag); err != nil {
		t.Fatalf("create tag failed: %v", err)
	}

	record.Set("tags", []string{tag.Id})
	if err := app.Save(record); err != nil {
		t.Fatalf("save relation failed: %v", err)
	}

	related, err := app.FindRecordsByFilter("smoke_items", "tags.id ?= '"+tag.Id+"'", "@rowid", 10, 0)
	if err != nil {
		t.Fatalf("multi relation filter failed: %v", err)
	}
	if len(related) == 0 {
		t.Fatal("expected multi relation filter to return a record")
	}

	if relationField, ok := col.Fields.GetByName("tags").(*core.RelationField); ok {
		relationField.MaxSelect = 1
		if err := app.Save(col); err != nil {
			t.Fatalf("convert relation to single failed: %v", err)
		}
		relationField.MaxSelect = 3
		if err := app.Save(col); err != nil {
			t.Fatalf("convert relation back to multiple failed: %v", err)
		}
	}

	auth := core.NewAuthCollection("smoke_auth")
	if err := app.Save(auth); err != nil {
		t.Fatalf("create auth collection failed: %v", err)
	}

	authRecord := core.NewRecord(auth)
	authRecord.Set("email", "Test@Example.com")
	authRecord.Set("password", "12345678")
	if err := app.Save(authRecord); err != nil {
		t.Fatalf("create auth record failed: %v", err)
	}

	if found, err := app.FindAuthRecordByEmail(auth, "Test@Example.com"); err != nil {
		t.Fatalf("find auth record by email failed: %v", err)
	} else if found.Id != authRecord.Id {
		t.Fatalf("unexpected auth record id %q", found.Id)
	}

	duplicateAuth := core.NewRecord(auth)
	duplicateAuth.Set("email", "Test@Example.com")
	duplicateAuth.Set("password", "12345678")
	if err := app.Save(duplicateAuth); err == nil {
		t.Fatal("expected duplicate auth email to fail")
	}

	col.Fields.Add(&core.TextField{Name: "note", Max: 255})
	if err := app.Save(col); err != nil {
		t.Fatalf("add field failed: %v", err)
	}

	col.Fields.RemoveByName("note")
	if err := app.Save(col); err != nil {
		t.Fatalf("remove field failed: %v", err)
	}

	if err := app.Vacuum(); err != nil {
		t.Fatalf("vacuum failed: %v", err)
	}

	backupName := "smoke_backup.zip"
	if err := app.CreateBackup(context.Background(), backupName); err != nil {
		t.Fatalf("create backup failed: %v", err)
	}

	backupPath := filepath.Join(dataDir, core.LocalBackupsDirName, backupName)
	archiveReader, err := zip.OpenReader(backupPath)
	if err != nil {
		t.Fatalf("open backup failed: %v", err)
	}
	defer archiveReader.Close()

	expectedDump := "data.sql"
	if app.DBDialect().IsPostgres() {
		expectedDump = "data.pgdump"
	}

	foundDump := false
	for _, file := range archiveReader.File {
		if file.Name == expectedDump {
			foundDump = true
			break
		}
	}
	if !foundDump {
		t.Fatalf("expected %s in backup archive", expectedDump)
	}
}
