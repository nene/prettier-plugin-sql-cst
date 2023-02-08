# SQL Style Guide

This document describes the style that Prettier plugin SQL-CST uses for formatting SQL.

- :white_check_mark: - decided and implemented
- :heavy_check_mark: - decided, but not yet implemented
- :question: - undecided

## Generic whitespace

This is based on the defaults used by Prettier:

- :white_check_mark: 2 spaces for indentation
- :white_check_mark: UNIX `\n` for newlines
- :white_check_mark: Final newline at the end of a file

## Upper & lower case

- :white_check_mark: UPPERCASE all keywords
- :white_check_mark: UPPERCASE all type names
- :white_check_mark: preserve case of function names
- :white_check_mark: preserve case of all other identifiers

Keywords include literal values like `NULL`, `TRUE`, `FALSE`,
but don't include function names that SQL dialects might themselves label as keywords (like `sum()`, `count()`),
notably the parameter-less builtin functions like `current_date` aren't considered to be keywords.

Undecided:

- :question: Should `CAST(x AS type)` expression be lowercase (treating it as a builtin function)
  or uppercase (treating it as a builtin expression)? (currently: UPPERCASE)

## Aliases

- :white_check_mark: Always use explicit `AS` keyword in all aliases

## Semicolons

- :heavy_check_mark: Finish all statements with a semicolon

Undecided:

- :question: Should single statement without a trailing semicolon be supported?

## Strings

- :heavy_check_mark: Use single quotes for strings if possible.
- :heavy_check_mark: Use different quote style when string contains single quotes or is multi-line.

This might need to be configurable,
though the support of single-quotes for strings should IMHO be available in all dialects.

## Quoted identifiers

There are various options here:

- :question: <del>Default to double quotes (SQL standard)</del>
  Not possible in some dialects like BigQuery.
- :question: Default to the preferred/default quoting style of a dialect,
  like backticks in MySQL and double quotes in SQLite.
- :question: Preserve existing quoting style.

This definitely needs to be configurable.

## Operators spacing

- :white_check_mark: Surround binary operators with whitespace: `1 + 2`
- :white_check_mark: Surround unary keyword-operators with whitespace: `NOT foo`
- :white_check_mark: Don't add whitespace to unary punctuation-operators: `-price`
- :heavy_check_mark: Add linebreak before binary operator:

```sql
WHERE
  first_name = 'John'
  AND age_bracket BETWEEN 12 AND 18
  AND income > 1000
```

similarly:

```sql
SELECT
  sqrt(normalized_power)
  + interval_duration
  + rest_duration
  + average_speed
```

## Comma spacing

- :white_check_mark: No whitespace before comma
- :white_check_mark: Single space after comma for inline list
- :white_check_mark: Newline after comma for multiline list

## Parenthesis spacing

- :white_check_mark: No space between function name and arguments. `my_func(1, 2, 3)`
- :white_check_mark: No space between single-word type name and arguments. `VARCHAR(100)`
- :white_check_mark: Space between multi-word type name and arguments. `UNSIGNED NUMERIC (10, 5)`
- :white_check_mark: Space between table/view/CTE name and columns list:

```sql
CREATE TABLE foo (
  id INT
);

CREATE VIEW my_view (col1, col2) AS
  SELECT 1, 2;

WITH my_cte (c1, c2) AS SELECT 1, 2
SELECT * FROM my_cte;
```

Undecided:

- :question: BigQuery options list: `OPTIONS(foo = bar)` v/s `OPTIONS (foo = bar)`
