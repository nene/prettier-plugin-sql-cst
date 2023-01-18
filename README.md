# Prettier plugin SQL-CST

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
SELECT id, client.name, organization.name
FROM client NATURAL JOIN organization
WHERE client.id = 12
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

[prettier]: https://prettier.io/
[sql-parser-cst]: https://github.com/nene/sql-parser-cst
[wadler-prettier]: http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf
