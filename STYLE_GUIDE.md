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
- :white_check_mark: Preserve single empty line between statements.

## Upper & lower case

- :white_check_mark: UPPERCASE all keywords. [Rule_L010][], [Rule_L040][]
- :white_check_mark: UPPERCASE all type names. [Rule_L063][]
- :white_check_mark: preserve case of function names. [Rule_L030][]
- :white_check_mark: preserve case of all other identifiers. [Rule_L014][]

Keywords include literal values like `NULL`, `TRUE`, `FALSE`,
but don't include function names that SQL dialects might themselves label as keywords (like `sum()`, `count()`),
notably the parameter-less builtin functions like `current_date` aren't considered to be keywords.

Undecided:

- :question: Should `CAST(x AS type)` expression be lowercase (treating it as a builtin function)
  or uppercase (treating it as a builtin expression)?
  SQLFluff treats `CAST()` as a function and applies upper/lower case depending on how it's
  configured for functions.
  Though that will lead to somewhat odd syntax when keywords are uppercase and function names lowercase,
  resulting in `cast(x AS TYPE)`.  
  (currently: UPPERCASE)

## Aliases

- :white_check_mark: Always use explicit `AS` keyword in all aliases. [Rule_L011][], [Rule_L012][]

## Semicolons

- :white_check_mark: Finish all statements with a semicolon. [Rule_L052][]

Undecided:

- :question: Should single statement without a trailing semicolon be supported?

## Strings

- :heavy_check_mark: Use single quotes for strings if possible.
- :heavy_check_mark: Use different quote style when string contains single quotes or is multi-line.

This might need to be configurable,
though the support of single-quotes for strings should IMHO be available in all dialects.

## Identifiers

- :heavy_check_mark: Don't unnecessarily quote an identifier. [Rule_L059][]
- :heavy_check_mark: Always quote identifiers that are keywords. [Rule_L029][]

For quoting style there are various options here:

- :question: <del>Default to double quotes (SQL standard)</del>
  Not possible in some dialects like BigQuery.
- :question: Default to the preferred/default quoting style of a dialect,
  like backticks in MySQL and double quotes in SQLite.
- :question: Preserve existing quoting style.

This definitely needs to be configurable.

## Operators

- :white_check_mark: Surround binary operators with whitespace: `1 + 2`
- :white_check_mark: Surround unary keyword-operators with whitespace: `NOT foo`
- :white_check_mark: Don't add whitespace to unary punctuation-operators: `-price`
- :heavy_check_mark: Use `!=` instead of `<>` for "not equal to" comparisons. [Rule_L061][]
- :heavy_check_mark: Add linebreak before binary operator: [Rule_L007][]

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
- :white_check_mark: Single space after comma for inline list. [Rule_L008][]
- :white_check_mark: Newline after comma for multiline list
- :white_check_mark: Forbid trailing commas in select clause. [Rule_L038][]

## Parenthesis spacing

- :white_check_mark: No space between function name and arguments. `my_func(1, 2, 3)` [Rule_L017][]
- :white_check_mark: No space between single-word type name and arguments. `VARCHAR(100)`
- :white_check_mark: Space between multi-word type name and arguments. `UNSIGNED NUMERIC (10, 5)`
- :white_check_mark: Space after `USING` in `JOIN`: `JOIN foo USING (col1)`
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

- :heavy_check_mark: Top-level statements should not be wrapped in brackets. [Rule_L053][]
- :heavy_check_mark: No parenthesis after `DISTINCT`. [Rule_L015][]

Undecided:

- :question: BigQuery options list: `OPTIONS(foo = bar)` v/s `OPTIONS (foo = bar)`

## Parenthesis

- :white-check-mark: Discard unnecessary nested parenthesis. `((1 + 2)) * 3` --> `(1 + 2) * 3`
- :white-check-mark: Discard parenthesis around function arguments. `count((id))` --> `count(id)`

## Rules to possibly adopt from SQLFluff

- [Rule_L022][]: Blank line after CTE.
- [Rule_L033][]: `UNION [DISTINCT|ALL]` is preferred over just `UNION`.
- [Rule_L034][]: Select wildcards then simple targets before calculations and aggregates.
- [Rule_L036][]: Select targets should be on a new line unless there is only one select target.
- [Rule_L037][]: Ambiguous ordering directions for columns in order by clause.
- [Rule_L047][]: Use consistent syntax to express "count number of rows", e.g. `count(*)` instead of `count(1)`
- [Rule_L049][]: Comparisons with NULL should use `IS` or `IS NOT`.
- [Rule_L051][]: Join clauses should be fully qualified, e.g. `INNER JOIN` instead of plain `JOIN`.
- [Rule_L058][]: Nested CASE statement in ELSE clause could be flattened.
- [Rule_L067][]: Enforce consistent type casting style, e.g. use `CAST(10 AS TEXT)` instead of `10::TEXT` or `CONVERT(10, TEXT)`

[Test with SQLFluff online.](https://online.sqlfluff.com/)

[Rule_L007]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L007
[Rule_L008]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L008
[Rule_L010]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L010
[Rule_L011]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L011
[Rule_L012]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L012
[Rule_L014]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L014
[Rule_L015]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L015
[Rule_L017]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L017
[Rule_L022]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L022
[Rule_L029]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L029
[Rule_L030]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L030
[Rule_L033]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L033
[Rule_L034]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L034
[Rule_L036]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L036
[Rule_L037]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L037
[Rule_L038]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L038
[Rule_L040]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L040
[Rule_L047]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L047
[Rule_L049]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L049
[Rule_L051]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L051
[Rule_L052]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L052
[Rule_L053]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L053
[Rule_L058]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L058
[Rule_L059]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L059
[Rule_L061]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L061
[Rule_L063]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L063
[Rule_L067]: https://docs.sqlfluff.com/en/stable/rules.html#sqlfluff.rules.Rule_L067
