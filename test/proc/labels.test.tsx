import dedent from "dedent-js";
import { testBigquery, testPlpgsql } from "../test_utils";

describe("labels", () => {
  it(`formats BREAK/CONTINUE`, async () => {
    await testBigquery(dedent`
      LOOP
        IF TRUE THEN
          BREAK;
        ELSE
          CONTINUE;
        END IF;
      END LOOP
    `);
  });

  it(`formats EXIT/CONTINUE with WHEN clause`, async () => {
    await testPlpgsql(dedent`
      <<my_label>> LOOP
        EXIT WHEN x < 10;
        CONTINUE WHEN x > 10;
      END LOOP
    `);

    await testPlpgsql(dedent`
      <<my_label>> LOOP
        EXIT my_label WHEN x < 10;
        CONTINUE my_label WHEN x > 10;
      END LOOP
    `);
  });

  it(`formats BigQuery labels`, async () => {
    await testBigquery(dedent`
      outer_loop: LOOP
        inner_loop: LOOP
          BREAK outer_loop;
        END LOOP;
      END LOOP
    `);
  });

  it(`formats BigQuery end labels`, async () => {
    await testBigquery(dedent`
      outer_loop: REPEAT
        inner_loop: LOOP
          CONTINUE outer_loop;
        END LOOP inner_loop;
      UNTIL TRUE END REPEAT outer_loop
    `);
  });

  it(`formats PL/pgSQL labels`, async () => {
    await testPlpgsql(dedent`
      <<outer_loop>> LOOP
        <<inner_loop>> LOOP
          EXIT outer_loop;
        END LOOP;
      END LOOP
    `);
  });

  it(`formats PL/pgSQL end labels`, async () => {
    await testPlpgsql(dedent`
      <<outer_loop>> LOOP
        <<inner_loop>> LOOP
          EXIT inner_loop;
        END LOOP inner_loop;
      END LOOP outer_loop
    `);
  });
});
