import * as path from "path";
import test from "ava";
import { Duplex } from "stream";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

import { isDirectory, isFile, writeMessage } from "../dist/file.js";

const TEST_DIRNAME = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../tmp"
);

test.before(() => fs.mkdir(TEST_DIRNAME, { recursive: true }));

test.after(() => fs.rmdir(TEST_DIRNAME, { recursive: true }));

test("isDirectory", async (t) => {
  t.is(await isDirectory(TEST_DIRNAME), true);
  t.is(await isDirectory(path.join(TEST_DIRNAME, "dne")), false);
});

test("isFile", async (t) => {
  t.is(await isFile(TEST_DIRNAME), false);
  t.is(await isFile(path.join(TEST_DIRNAME, "rando.txt")), false);
  t.is(await isFile(fileURLToPath(import.meta.url)), true);
});

test("writeMessage :: success", async (t) => {
  const mockFilename = path.join(TEST_DIRNAME, "message.txt");
  const message = "It's a mock message!";

  const mockIncomingMessage = new Duplex();
  mockIncomingMessage.push(Buffer.from(message));
  mockIncomingMessage.push(null);

  await writeMessage(mockFilename, mockIncomingMessage);

  t.is(
    await fs.readFile(mockFilename, { encoding: "utf-8" }),
    message,
    "writes message to filename"
  );
});

test("writeMessage :: error", async (t) => {
  const error = await t.throwsAsync(() =>
    writeMessage(path.join(TEST_DIRNAME, "dir/dne/message.txt"), {
      pipe() {
        return;
      },
    })
  );

  t.regex(error.message, /ENOENT/);
});
