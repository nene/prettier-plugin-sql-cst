# Prettier plugin SQL-CST [![npm version](https://img.shields.io/npm/v/prettier-plugin-sql-cst)](https://www.npmjs.com/package/prettier-plugin-sql-cst) ![build status](https://github.com/nene/prettier-plugin-sql-cst/actions/workflows/build.yml/badge.svg)

A [Prettier][] plugin for SQL that uses [sql-parser-cst][] and the
actual [Prettier formatting algorithm][wadler-prettier].

**[Try it live!][live]**

Like Prettier for JavaScript,
this plugin formats SQL expressions differently depending on their length.
A short SQL query will be formatted on a single line:

```sql
SELECT a, b, c FROM tbl WHERE x > 10;
```

A longer query, will get each clause printed on a separate line:

```sql
SELECT id, client.name, client.priority
FROM client
WHERE client.id IN (12, 18, 121);
```

An even longer one gets the contents of each clause indented:

```sql
SELECT
  client.id,
  client.name AS client_name,
  organization.name AS org_name,
  count(orders.id) AS nr_of_orders
FROM
  client
  LEFT JOIN organization ON client.organization_id = organization.id
  LEFT JOIN orders ON orders.client_id = client.id
WHERE
  client.status = 'active'
  AND client.id IN (28, 214, 457)
  AND orders.status IN ('active', 'pending', 'processing')
GROUP BY client.id
ORDER BY client.name
LIMIT 100;
```

## Formatting philosophy

- Adapt formatting based on expression length.
- Stick to one style and avoid configuration options.
- Format embedded languages (like JSON data and JavaScript programs).
- When unsure, preserve existing syntax.

Currently this plugin preserves most of the syntax elements
and concentrates mainly on the layout of whitespace.

See [STYLE_GUIDE][] for overview of the SQL formatting style used.

## Getting started

Install it as any other Prettier plugin:

```
npm install --save-dev prettier prettier-plugin-sql-cst
```

Then use it on SQL files through Prettier command line tool or Prettier extension
for your editor of choice.

## Choosing an SQL dialect

By default the plugin will determine SQL dialect based on file extension:

- `.sql` or `.sqlite` - SQLite
- `.bigquery` - BigQuery

You can override this behavior with a prettier configuration:

```json
{
  "overrides": [
    {
      "files": ["*.sql"],
      "options": { "parser": "bigquery" }
    }
  ]
}
```

The plugin provides the following parsers:

- `sqlite`
- `bigquery`
- `postgresql` (**experimental! expect crashes**)
- `mysql` (**experimental! expect crashes**)
- `mariadb` (**experimental! expect crashes**)

## Configuration

The standard Prettier options [printWidth][], [tabWidth][], [useTabs][] apply.
There are also some SQL-specific options:

| API Option       | Default | Description                                                               |
| ---------------- | :-----: | ------------------------------------------------------------------------- |
| `sqlKeywordCase` | `upper` | Converts SQL keywords to `upper` or `lower` case, or `preserve` existing. |
| `sqlParamTypes`  |  `[]`   | Array of bound parameter types: `?`, `?nr`, `:name`, `@name`, `$name`.    |

## Limitations and development status

Currently this plugin supports two SQL dialects:

- **SQLite** - full support.
- **BigQuery** - full support.

It also has experimental support for the following dialects:

- PostgreSQL
- MySQL
- MariaDB

The main limitation is that [the parser][sql-parser-cst] does not support full syntax of
these dialects. One should expect the parser to crash for syntax that's more specific to
these dialects. But as long as the parsing succeeds, the formatting should also succeed.
Mainly one can expect the formatting of SELECT statements to work. But beyond that you should
keep your expectations low. You have been warned.

The specifics of the [SQL formatting style][STYLE_GUIDE] are still very much subject to change.
Though the general principles should be mostly in place by now.

[prettier]: https://prettier.io/
[live]: https://nene.github.io/prettier-sql-playground/
[printWidth]: https://prettier.io/docs/en/options.html#print-width
[tabWidth]: https://prettier.io/docs/en/options.html#tab-width
[useTabs]: https://prettier.io/docs/en/options.html#tabs
[sql-parser-cst]: https://github.com/nene/sql-parser-cst
[wadler-prettier]: http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf
[STYLE_GUIDE]: ./STYLE_GUIDE.md
