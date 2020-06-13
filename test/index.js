import * as fs from "fs/promises";
import * as path from "path";
import test from "ava";
import { createServer } from "http";
import { fileURLToPath } from "url";

import { getDate } from "../dist/util.js";
import { main } from "../dist/index.js";

const TEST_DIRNAME = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../tmp/index"
);
const TEST_PORT = 3002;

let server;

test.before(() =>
  Promise.all([
    new Promise((resolve) => {
      server = createServer((req, res) => {
        res.end("Sample message");
      });

      server.listen(TEST_PORT, resolve);
    }),
    fs.mkdir(TEST_DIRNAME, { recursive: true }),
  ])
);

test.after(() =>
  Promise.all([
    new Promise((resolve) => server.close(resolve)),
    fs.rmdir(TEST_DIRNAME, { recursive: true }),
  ])
);

test("main", async (t) => {
  await main({
    config: [
      {
        name: "test",
        url: `http://localhost:${TEST_PORT}`,
      },
    ],
    outDir: TEST_DIRNAME,
  });

  const date = new Date();
  const dir = path.join(TEST_DIRNAME, "test", ...getDate(date));

  const dirStat = await fs.stat(dir);

  t.is(dirStat.isDirectory(), true, "writes date directory");

  const contents = await fs.readdir(dir);

  t.is(contents.length, 1, "writes file");

  t.is(
    await fs.readFile(path.join(dir, contents[0]), { encoding: "utf-8" }),
    "Sample message",
    "writes file contents"
  );
});
