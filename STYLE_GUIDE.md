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
