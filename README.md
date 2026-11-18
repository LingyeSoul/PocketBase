<p align="center">
    <a href="https://pocketbase.io" target="_blank" rel="noopener">
        <img src="https://ganigeorgiev.com/api/git/pocketbase/pocketbase/content/.bugstage/readme.png" alt="PocketBase - open source backend in 1 file" />
    </a>
</p>

<p align="center">
    <a href="https://pkg.go.dev/github.com/lingyesoul/pocketbase" target="_blank" rel="noopener"><img src="https://pkg.go.dev/badge/github.com/lingyesoul/pocketbase.svg" alt="Go package documentation" /></a>
</p>

> **Fork notice** — This repository is a modified copy of [PocketBase](https://pocketbase.io)
> **v0.42.3**, MIT licensed, © 2022 - present Gani Georgiev.
> See [LICENSE.md](LICENSE.md) for the upstream license text and [LICENSE](LICENSE) for the
> combined copyright notice. This copy is **not affiliated with or endorsed by** the PocketBase project.
> Report bugs of the upstream code at https://ganigeorgiev.com/pocketbase/pocketbase;
> report bugs of the changes made here in this repository.

[PocketBase](https://pocketbase.io) is an open source Go backend that includes:

- embedded database (_SQLite_) with **realtime subscriptions**
- built-in **files and users management**
- convenient **Superuser dashboard UI**
- and simple **REST-ish API**

**For documentation and examples, please visit https://pocketbase.io/docs .**

> **NB!** Please keep in mind that PocketBase is still under active development
> and full backward compatibility is not guaranteed before reaching v1.0.0.


## Alternative databases

SQLite remains the default and the upstream-compatible mode. This fork also
supports PostgreSQL, MySQL and MariaDB through the same `core.App` API:

```sh
# PostgreSQL
./pocketbase serve \
  --dbDriver=postgres \
  --dbDSN="postgres://user:password@127.0.0.1:5432/pocketbase?sslmode=disable"

# MySQL or MariaDB (use --dbDriver=mariadb for MariaDB-specific DDL)
./pocketbase serve \
  --dbDriver=mysql \
  --dbDSN="user:password@tcp(127.0.0.1:3306)/pocketbase?parseTime=false&charset=utf8mb4"

./pocketbase serve \
  --dbDriver=mariadb \
  --dbDSN="user:password@tcp(127.0.0.1:3306)/pocketbase?parseTime=false&charset=utf8mb4"
```

The same options are available in `pocketbase.Config` as `DefaultDBDriver`,
`DefaultDBDSN` and `DefaultAuxDBDSN`. For programmatic use, set
`core.BaseAppConfig.DBDriver`, `DBDSN` and optionally `AuxDBDSN`, or keep using
the `DBConnect` hook for a fully custom connection.

Driver notes:

- PostgreSQL uses the pure Go `pgx/v5` driver and is tested against PostgreSQL 18.
- MySQL uses `go-sql-driver/mysql` and is tested against MySQL 8.4 (8.0.13+ is
  required for functional indexes and expression defaults).
- MariaDB uses the same MySQL driver and is tested against MariaDB 11.8.
- `--auxDBDSN` is optional; when omitted the auxiliary database uses the same
  DSN as the main database.
- One-click backups require `pg_dump`/`pg_restore` or `mysqldump`/`mysql` to be
  available in `PATH` for non-SQLite databases.
- Reduce `DataMaxOpenConns`/`AuxMaxOpenConns` for server databases so the total
  pool size stays below the database `max_connections` limit.

Known MySQL/MariaDB limitations:

- Text fields that may be indexed use `VARCHAR(768)`; longer unindexed text is
  stored as `LONGTEXT`. A unique index that needs more key bytes than the
  InnoDB limit must be shortened or enforced by the application.
- Partial unique indexes are emulated with MySQL functional indexes and with
  hidden generated columns on MariaDB. Only the common `column != ''` form is
  supported; other partial unique expressions are rejected with an error.
- MariaDB and MySQL use their case-insensitive collations for email/username
  indexes; PostgreSQL uses `lower(...)` expression indexes.
- JSON values are stored as text so the API output is not normalized by the
  database JSON type.
- `@rowid` sorting and record counting map to the `id` column on non-SQLite
  databases.
- The `strftime` filter function supports the common SQLite format specifiers
  and simple date modifiers; unsupported format/modifier combinations return a
  validation error instead of silently producing a different result.
- Raw SQL in user migrations and view collections is dialect-specific. Existing
  SQLite SQL is not translated automatically.
- External databases do not make the whole application horizontally scalable:
  realtime subscriptions, cron and file storage remain process-local.

For the integration smoke test, set a test DSN and run:

```sh
PB_TEST_DB_DRIVER=postgres \
PB_TEST_DB_DSN="postgres://postgres@127.0.0.1:5432/pocketbase_test?sslmode=disable" \
go test ./tests -run TestMultiDBSmoke -count=1
```

## API SDK clients

The easiest way to interact with the PocketBase Web APIs is to use one of the official SDK clients:

- **JavaScript - [pocketbase/js-sdk](https://ganigeorgiev.com/pocketbase/js-sdk)** (_Browser, Node.js, React Native_)
- **Dart - [pocketbase/dart-sdk](https://ganigeorgiev.com/pocketbase/dart-sdk)** (_Web, Mobile, Desktop, CLI_)

You could also check the recommendations in https://pocketbase.io/docs/how-to-use/.


## Overview

### Use as standalone app

You could download the prebuilt executable for your platform from the [Releases page](https://ganigeorgiev.com/pocketbase/pocketbase/releases).
Once downloaded, extract the archive and run `./pocketbase serve` in the extracted directory.

The prebuilt executables are based on the [`examples/base/main.go` file](https://ganigeorgiev.com/pocketbase/pocketbase/files/examples/base/main.go) and comes with the JS VM plugin enabled by default which allows to extend PocketBase with JavaScript (_for more details please refer to [Extend with JavaScript](https://pocketbase.io/docs/js-overview/)_).

### Use as a Go framework/toolkit

PocketBase is distributed as a regular Go library package which allows you to build
your own custom app specific business logic and still have a single portable executable at the end.

Here is a minimal example:

0. [Install Go 1.27+](https://go.dev/doc/install) (_if you haven't already_)

1. Create a new project directory with the following `main.go` file inside it:
    ```go
    package main

    import (
        "log"

        "github.com/lingyesoul/pocketbase"
        "github.com/lingyesoul/pocketbase/core"
    )

    func main() {
        app := pocketbase.New()

        app.OnServe().BindFunc(func(se *core.ServeEvent) error {
            // registers new "GET /hello" route
            se.Router.GET("/hello", func(re *core.RequestEvent) error {
                return re.String(200, "Hello world!")
            })

            return se.Next()
        })

        if err := app.Start(); err != nil {
            log.Fatal(err)
        }
    }
    ```

2. To init the dependencies, run `go mod init myapp && go mod tidy`.

3. To start the application, run `go run main.go serve`.

4. To build a statically linked executable, you can run `CGO_ENABLED=0 go build` and then start the created executable with `./myapp serve`.

_For more details please refer to [Extend with Go](https://pocketbase.io/docs/go-overview/)._

### Building and running the repo main.go example

To build the minimal standalone executable, like the prebuilt ones in the releases page, you can simply run `go build` inside the `examples/base` directory:

0. [Install Go 1.27+](https://go.dev/doc/install) (_if you haven't already_)
1. Clone/download the repo
2. Navigate to `examples/base`
3. Run `CGO_ENABLED=0 go build` to build a binary for your current environment
   _(or to target other platforms use `GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build`; see https://go.dev/doc/install/source#environment)_
4. Start the created executable by running `./base serve`.

Note that the supported build targets by the pure Go SQLite driver at the moment are:

| GOOS    | GOARCH  |
|---------|---------|
| darwin  | amd64   |
| darwin  | arm64   |
| freebsd | 386     |
| freebsd | amd64   |
| freebsd | arm     |
| freebsd | arm64   |
| linux   | 386     |
| linux   | amd64   |
| linux   | arm     |
| linux   | arm64   |
| linux   | loong64 |
| linux   | ppc64le |
| linux   | riscv64 |
| linux   | s390x   |
| netbsd  | amd64   |
| openbsd | amd64   |
| openbsd | arm64   |
| windows | 386     |
| windows | amd64   |
| windows | arm64   |

### Testing

PocketBase comes with mixed bag of unit and integration tests.
To run them, use the standard `go test` command:

```sh
go test ./...
```

Check also the [Testing guide](http://pocketbase.io/docs/testing) to learn how to write your own custom application tests.


## Security

If you discover a security vulnerability within PocketBase, please submit a [private bug](https://ganigeorgiev.com/pocketbase/discussions/new/Bugs?private=1) OR send an e-mail to **support at pocketbase.io**.

You could find more details in the project [Security policy](https://ganigeorgiev.com/pocketbase/pocketbase/files/SECURITY.md).


## Contributing

PocketBase is free and open source project licensed under the [MIT License](https://ganigeorgiev.com/pocketbase/pocketbase/files/LICENSE.md).

You are free to do whatever you want with it, even offering it as a paid service
_(if you decide to do the latter, please make it clear that your service is not affiliated with the PocketBase project to avoid people wrongly submitting issues related to your service in the project's tracker)_.

You could help me by:

- [Report bugs and security issues](https://ganigeorgiev.com/pocketbase/discussions?category=Bugs)
- [Suggesting new features](https://ganigeorgiev.com/pocketbase/discussions?category=Feature+requests)
- [Help other people in the discussions](https://ganigeorgiev.com/pocketbase/discussions)
