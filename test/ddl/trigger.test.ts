import dedent from "dedent-js";
import { test, testPostgresql } from "../test_utils";

describe("trigger", () => {
  describe("create trigger", () => {
    it(`formats CREATE TRIGGER .. INSTEAD OF UPDATE OF`, async () => {
      await test(dedent`
        CREATE TRIGGER cust_addr_chng
        INSTEAD OF UPDATE OF cust_addr ON customer_address
        BEGIN
          UPDATE customer
          SET cust_addr = NEW.cust_addr
          WHERE cust_id = NEW.cust_id;
        END
      `);
    });

    it(`formats long UPDATE OF column list`, async () => {
      await test(dedent`
        CREATE TRIGGER cust_addr_chng
        INSTEAD OF UPDATE OF
          cust_address,
          cust_zip_code,
          cust_country,
          super_long_column_name
        ON customer_address
        BEGIN
          DELETE FROM customer;
        END
      `);
    });

    it(`formats TEMPORARY TRIGGER IF NOT EXISTS`, async () => {
      await test(dedent`
        CREATE TEMPORARY TRIGGER IF NOT EXISTS cust_addr_del
        DELETE ON customer_address
        BEGIN
          DELETE FROM customer;
        END
      `);
    });

    it(`formats FOR EACH ROW`, async () => {
      await test(dedent`
        CREATE TRIGGER cust_addr_del
        INSERT ON customer_address
        FOR EACH ROW
        BEGIN
          DELETE FROM customer
          WHERE cust_id = OLD.id;
        END
      `);
    });

    it(`formats WHEN condition`, async () => {
      await test(dedent`
        CREATE TRIGGER cust_addr_del
        INSERT ON customer_address
        FOR EACH ROW
        WHEN priority > 10
        BEGIN
          DELETE FROM customer;
        END
      `);
    });

    it(`formats long WHEN condition`, async () => {
      await test(dedent`
        CREATE TRIGGER cust_addr_del
        INSERT ON customer_address
        WHEN
          customer_address.priority > 10
          AND customer_address.id IS NOT NULL
          AND customer_address.priority < 100
        BEGIN
          DELETE FROM customer;
        END
      `);
    });

    it(`formats PostgreSQL EXECUTE FUNCTION syntax`, async () => {
      await testPostgresql(dedent`
        CREATE TRIGGER my_trig
        AFTER TRUNCATE ON my_tbl
        EXECUTE FUNCTION my_func(1, 2, 3, 'Hello')
      `);
    });

    it(`formats long PostgreSQL EXECUTE FUNCTION syntax`, async () => {
      await testPostgresql(dedent`
        CREATE TRIGGER my_trig
        AFTER TRUNCATE ON my_tbl
        EXECUTE FUNCTION my_funtion_name(
          'first argument',
          'second argument',
          'third argument',
          'fourth argument'
        )
      `);
    });

    it(`formats OR REPLACE CONSTRAINT TRIGGER`, async () => {
      await testPostgresql(dedent`
        CREATE OR REPLACE CONSTRAINT TRIGGER my_trig
        INSTEAD OF UPDATE ON my_tbl
        EXECUTE FUNCTION fn()
      `);
    });

    it(`formats multiple events`, async () => {
      await testPostgresql(dedent`
        CREATE TRIGGER my_trig
        AFTER INSERT OR UPDATE OF col1, col2 OR DELETE ON my_tbl
        EXECUTE FUNCTION my_func()
      `);
    });

    it(`formats FROM clause`, async () => {
      await testPostgresql(dedent`
        CREATE CONSTRAINT TRIGGER my_trig
        AFTER INSERT ON my_tbl
        FROM schm.my_tbl
        EXECUTE FUNCTION my_func()
      `);
    });

    it(`formats timing clause`, async () => {
      await testPostgresql(dedent`
        CREATE TRIGGER my_trig
        AFTER INSERT ON my_tbl
        DEFERRABLE INITIALLY DEFERRED
        EXECUTE FUNCTION my_func()
      `);
    });

    it(`formats referencing clause`, async () => {
      await testPostgresql(dedent`
        CREATE TRIGGER my_trig
        AFTER INSERT ON my_tbl
        REFERENCING OLD TABLE AS old_table, NEW ROW AS ref_tbl_new
        EXECUTE FUNCTION my_func()
      `);
    });
    it(`formats long referencing clause`, async () => {
      await testPostgresql(dedent`
        CREATE TRIGGER my_trig
        AFTER INSERT ON my_tbl
        REFERENCING
          OLD TABLE AS very_long_old_table,
          NEW ROW AS especially_long_new_row_name
        EXECUTE FUNCTION my_func()
      `);
    });
  });

  describe("alter trigger", () => {
    it(`formats ALTER TRIGGER .. RENAME TO on single line`, async () => {
      await testPostgresql(dedent`
        ALTER TRIGGER my_trigger ON my_table RENAME TO new_name
      `);
    });

    it(`formats ALTER TRIGGER .. RENAME TO on multiple lines (if user prefers)`, async () => {
      await testPostgresql(dedent`
        ALTER TRIGGER my_trigger ON my_table
        RENAME TO new_name
      `);
    });

    it(`formats ALTER TRIGGER .. [NO] DEPENDS ON EXTENSION`, async () => {
      await testPostgresql(dedent`
        ALTER TRIGGER my_trigger ON my_table
        DEPENDS ON EXTENSION ext_name
      `);
      await testPostgresql(dedent`
        ALTER TRIGGER my_trigger ON my_table
        NO DEPENDS ON EXTENSION ext_name
      `);
    });
  });

  describe("drop trigger", () => {
    it(`formats DROP TRIGGER`, async () => {
      await test(`DROP TRIGGER my_trigger`);
    });

    it(`formats IF EXISTS`, async () => {
      await test(`DROP TRIGGER IF EXISTS my_trigger`);
    });

    it(`formats CASCADE/RESTRICT`, async () => {
      await testPostgresql(`DROP TRIGGER my_trigger CASCADE`);
    });
  });
});
