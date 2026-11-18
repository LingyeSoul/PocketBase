package dbutils

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

var sqliteDateModifierRegex = regexp.MustCompile(`(?i)^\s*([+-]?\d+)\s+(second|minute|hour|day|month|year)s?\s*$`)

// RandomFor returns the dialect-specific random function used for ordering.
func RandomFor(dialect Dialect) string {
	switch dialect {
	case DialectPostgres:
		return "random()"
	case DialectMySQL, DialectMariaDB:
		return "RAND()"
	default:
		return "RANDOM()"
	}
}

// RowIDFor returns the dialect-specific row identifier expression.
func RowIDFor(dialect Dialect) string {
	if dialect.IsSQLite() {
		return "[[_rowid_]]"
	}

	return "[[id]]"
}

// CountColumnFor returns the preferred column for COUNT(DISTINCT ...).
func CountColumnFor(dialect Dialect) string {
	if dialect.IsSQLite() {
		return "_rowid_"
	}

	return "id"
}

// LikeFor builds a case-insensitive LIKE expression for the dialect.
//
// When rightIsColumn is true the right operand is treated as a column and the
// wildcard wrapping is done in SQL; otherwise the caller is expected to wrap
// the bound parameter value with "%".
func LikeFor(dialect Dialect, left string, right string, negate bool, rightIsColumn bool) string {
	operator := "LIKE"
	if dialect.IsPostgres() {
		operator = "ILIKE"
	}
	if negate {
		operator = "NOT " + operator
	}

	if !rightIsColumn {
		switch dialect {
		case DialectMySQL, DialectMariaDB:
			return fmt.Sprintf("%s %s %s ESCAPE '\\\\'", left, operator, right)
		default:
			return fmt.Sprintf("%s %s %s ESCAPE '\\'", left, operator, right)
		}
	}

	switch dialect {
	case DialectMySQL, DialectMariaDB:
		return fmt.Sprintf("%s %s CONCAT('%%', %s, '%%') ESCAPE '\\\\'", left, operator, right)
	case DialectPostgres:
		return fmt.Sprintf("%s %s ('%%' || %s || '%%') ESCAPE '\\'", left, operator, right)
	default:
		return fmt.Sprintf("%s %s ('%%' || %s || '%%') ESCAPE '\\'", left, operator, right)
	}
}

// StrftimeFor translates a SQLite strftime call to the dialect equivalent.
func StrftimeFor(dialect Dialect, format string, timeExpr string, modifiers []string) (string, error) {
	if dialect.IsSQLite() {
		args := []string{sqlStringLiteral(format), timeExpr}
		args = append(args, modifiers...)
		return "strftime(" + strings.Join(args, ",") + ")", nil
	}

	timeExpr, err := applyDateModifiers(dialect, timeExpr, modifiers)
	if err != nil {
		return "", err
	}

	switch dialect {
	case DialectPostgres:
		pgFormat, err := translateStrftimeFormat(format, true)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("to_char((%s)::timestamp, %s)", timeExpr, sqlStringLiteral(pgFormat)), nil
	case DialectMySQL, DialectMariaDB:
		mysqlFormat, err := translateStrftimeFormat(format, false)
		if err != nil {
			return "", err
		}
		return fmt.Sprintf("DATE_FORMAT(%s, %s)", timeExpr, sqlStringLiteral(mysqlFormat)), nil
	default:
		return "", fmt.Errorf("strftime is not supported for dialect %q", dialect)
	}
}

// TruncateHourFor returns an expression that formats a timestamp to its hour bucket.
func TruncateHourFor(dialect Dialect, column string) string {
	switch dialect {
	case DialectPostgres:
		return fmt.Sprintf("to_char(date_trunc('hour', ([[%s]])::timestamp), 'YYYY-MM-DD HH24:00:00')", column)
	case DialectMySQL, DialectMariaDB:
		return "DATE_FORMAT([[" + column + "]], '%Y-%m-%d %H:00:00')"
	default:
		return "strftime('%Y-%m-%d %H:00:00', [[" + column + "]])"
	}
}

func applyDateModifiers(dialect Dialect, timeExpr string, modifiers []string) (string, error) {
	for _, modifier := range modifiers {
		modifier = strings.TrimSpace(modifier)
		if modifier == "" {
			continue
		}

		lower := strings.ToLower(modifier)
		switch lower {
		case "start of day":
			if dialect.IsPostgres() {
				timeExpr = fmt.Sprintf("date_trunc('day', (%s)::timestamp)", timeExpr)
			} else {
				timeExpr = fmt.Sprintf("DATE(%s)", timeExpr)
			}
			continue
		case "start of month":
			if dialect.IsPostgres() {
				timeExpr = fmt.Sprintf("date_trunc('month', (%s)::timestamp)", timeExpr)
			} else {
				timeExpr = fmt.Sprintf("DATE_FORMAT(%s, '%%Y-%%m-01')", timeExpr)
			}
			continue
		case "start of year":
			if dialect.IsPostgres() {
				timeExpr = fmt.Sprintf("date_trunc('year', (%s)::timestamp)", timeExpr)
			} else {
				timeExpr = fmt.Sprintf("DATE_FORMAT(%s, '%%Y-01-01')", timeExpr)
			}
			continue
		}

		matches := sqliteDateModifierRegex.FindStringSubmatch(modifier)
		if len(matches) != 3 {
			return "", fmt.Errorf("unsupported strftime modifier %q for dialect %q", modifier, dialect)
		}

		amount, err := strconv.Atoi(matches[1])
		if err != nil {
			return "", fmt.Errorf("invalid strftime modifier %q: %w", modifier, err)
		}
		unit := strings.ToUpper(matches[2])
		if dialect.IsPostgres() {
			timeExpr = fmt.Sprintf("((%s)::timestamp + interval '%d %s')", timeExpr, amount, unit)
		} else {
			timeExpr = fmt.Sprintf("DATE_ADD(%s, INTERVAL %d %s)", timeExpr, amount, unit)
		}
	}

	return timeExpr, nil
}

func translateStrftimeFormat(format string, postgres bool) (string, error) {
	var result strings.Builder

	for i := 0; i < len(format); i++ {
		if format[i] != '%' {
			result.WriteByte(format[i])
			continue
		}

		if i+1 >= len(format) {
			return "", fmt.Errorf("invalid strftime format %q", format)
		}

		i++
		specifier := format[i]
		if specifier == '%' {
			result.WriteByte('%')
			continue
		}

		if postgres {
			switch specifier {
			case 'Y':
				result.WriteString("YYYY")
			case 'y':
				result.WriteString("YY")
			case 'm':
				result.WriteString("MM")
			case 'd':
				result.WriteString("DD")
			case 'H':
				result.WriteString("HH24")
			case 'M':
				result.WriteString("MI")
			case 'S':
				result.WriteString("SS")
			case 'f':
				result.WriteString("SS.MS")
			case 'j':
				result.WriteString("DDD")
			case 'W':
				result.WriteString("WW")
			default:
				return "", fmt.Errorf("unsupported strftime specifier %%%c for postgres", specifier)
			}
			continue
		}

		switch specifier {
		case 'Y', 'y', 'm', 'd', 'H', 'S', 'j':
			result.WriteByte('%')
			result.WriteByte(specifier)
		case 'M':
			result.WriteString("%i")
		case 'f':
			result.WriteString("%f")
		case 'W':
			result.WriteString("%v")
		default:
			return "", fmt.Errorf("unsupported strftime specifier %%%c for mysql", specifier)
		}
	}

	return result.String(), nil
}

func sqlStringLiteral(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "''") + "'"
}
