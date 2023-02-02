# Prettier plugin SQL-CST [![npm version](https://img.shields.io/npm/v/prettier-plugin-sql-cst)](https://www.npmjs.com/package/prettier-plugin-sql-cst) ![build status](https://github.com/nene/prettier-plugin-sql-cst/actions/workflows/build.yml/badge.svg)

A [Prettier][] plugin for SQL that uses [sql-parser-cst][] and the
actual [Prettier formatting algorithm][wadler-prettier].

Like Prettier for JavaScript,
this plugin formats SQL expressions differently depending on their length.
A short SQL query will be formatted on a single line:

```sql
SELECT a, b, c FROM tbl WHERE x > 10
```

A longer query, will get each clause printed on a separate line:

```sql
SELECT id, client.name, client.priority
FROM client
WHERE client.id IN (12, 18, 121)
```

An even longer one gets the contents of each clause indented:

```sql
SELECT
  client.id,
  client.name AS client_name,
  organization.name AS org_name,
  count(order.id) AS nr_of_orders
FROM
  client
  LEFT JOIN organization ON client.organization_id = organization.id
  LEFT JOIN order ON order.client_id = client.id
WHERE
  client.status = 'active'
  AND client.id IN (28, 214, 457)
  AND order.status IN ('active', 'pending', 'processing')
GROUP BY client.id
ORDER BY client.name
LIMIT 100
```

## Getting started

Install it as any other Prettier plugin:

```
npm install --save-dev prettier prettier-plugin-sql-cst
```

Then use it on SQL files though Prettier command line tool or Prettier extension
for your editor of choice.

## Configuration

The standard Prettier options apply. There are also some SQL-specific options:

| API Option       |  Default   | Description                                            |
| ---------------- | :--------: | ------------------------------------------------------ |
| `printWidth`     |    `80`    | [Same as in Prettier][prettier-print-width]            |
| `tabWidth`       |    `2`     | [Same as in Prettier][prettier-tab-width]              |
| `useTabs`        |  `false`   | [Same as in Prettier][prettier-use-tabs]               |
| `sqlKeywordCase` | `preserve` | Converts SQL keywords to `upper` or `lower` case.      |
| `sqlAliasAs`     | `preserve` | Uses AS keyword in aliases either `always` or `never`. |

## Limitations and development status

Currently this plugin only supports subset of **SQLite** syntax.
Formatting of the following SQL statements is fully implemented:

- SELECT
- UPDATE
- INSERT
- DELETE
- CREATE / DROP / ALTER TABLE
- CREATE / DROP VIEW
- CREATE / DROP INDEX

Unlike Prettier for JavaScript, this plugin currently preserves all the syntax elements.
For example it does not add/remove paratheses or modify the case of keywords (by default).
It only manipulates whitespace.

This will likely change in the future, with the goal of being more opinionated.
Some possibilities:

- capitalize all keywords
- ensure all alias definitions use the `AS` keyword.
- ensure consistent use of quotes (e.g. always quote keywords)
- eliminate redundant parenthesis.

The exact formatting style is also very much still in flux.
The overall goal is to have no options to configure different styles,
but rather to develop one opinionated style of formatting SQL.

[prettier]: https://prettier.io/
[prettier-print-width]: https://prettier.io/docs/en/options.html#print-width
[prettier-tab-width]: https://prettier.io/docs/en/options.html#tab-width
[prettier-use-tabs]: https://prettier.io/docs/en/options.html#tabs
[sql-parser-cst]: https://github.com/nene/sql-parser-cst
[wadler-prettier]: http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf
