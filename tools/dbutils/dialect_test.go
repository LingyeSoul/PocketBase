package dbutils

import (
	"strings"
	"testing"
)

func TestIndexBuildForDialect(t *testing.T) {
	index := Index{
		Unique:    true,
		IndexName: "idx_email",
		TableName: "users",
		Where:     "email != ''",
		Columns:   []IndexColumn{{Name: "email", Collate: "nocase"}},
	}

	postgresSQL, err := index.BuildFor(DialectPostgres)
	if err != nil {
		t.Fatal(err)
	}
	if postgresSQL != `CREATE UNIQUE INDEX "idx_email" ON "users" (lower("email")) WHERE email != ''` {
		t.Fatalf("unexpected postgres index: %s", postgresSQL)
	}

	mysqlSQL, err := index.BuildFor(DialectMySQL)
	if err != nil {
		t.Fatal(err)
	}
	if mysqlSQL != "CREATE UNIQUE INDEX `idx_email` ON `users` ((NULLIF(`email`, '')))" {
		t.Fatalf("unexpected mysql index: %s", mysqlSQL)
	}

	mariadbSQL, err := index.BuildFor(DialectMariaDB)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(mariadbSQL, index.PartialUniqueColumnName()) {
		t.Fatalf("unexpected mariadb index: %s", mariadbSQL)
	}
}

func TestLikeForDialect(t *testing.T) {
	if got := LikeFor(DialectPostgres, "title", "name", false, true); got != `title ILIKE ('%' || name || '%') ESCAPE '\'` {
		t.Fatalf("unexpected postgres like: %s", got)
	}

	if got := LikeFor(DialectMySQL, "title", "name", false, true); got != `title LIKE CONCAT('%', name, '%') ESCAPE '\\'` {
		t.Fatalf("unexpected mysql like: %s", got)
	}
}

func TestStrftimeForDialect(t *testing.T) {
	postgresSQL, err := StrftimeFor(DialectPostgres, "%Y-%m-%d", "created", nil)
	if err != nil {
		t.Fatal(err)
	}
	if postgresSQL != `to_char((created)::timestamp, 'YYYY-MM-DD')` {
		t.Fatalf("unexpected postgres strftime: %s", postgresSQL)
	}

	mysqlSQL, err := StrftimeFor(DialectMySQL, "%Y-%m-%d", "created", []string{"+1 day"})
	if err != nil {
		t.Fatal(err)
	}
	if mysqlSQL != `DATE_FORMAT(DATE_ADD(created, INTERVAL 1 DAY), '%Y-%m-%d')` {
		t.Fatalf("unexpected mysql strftime: %s", mysqlSQL)
	}
}
