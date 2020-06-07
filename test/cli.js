import test from "ava";

import { parseArgs } from "../dist/cli.js";

test("parseArgs", (t) => {
  t.deepEqual(parseArgs(["--something-big", "--other", "thing"]), {
    somethingBig: true,
    other: "thing",
  });

  t.deepEqual(parseArgs(["/random/files.txt", "/more/files.jpg"]), {
    "/random/files.txt": null,
    "/more/files.jpg": null,
  });
});
