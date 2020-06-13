import test from "ava";

import { validateConfig } from "../dist/config.js";

test("config :: invalid shape", (t) => {
  t.throws(
    () => validateConfig(),
    {
      message: /to be an array/,
    },
    "non-array"
  );
  t.throws(
    () => validateConfig([]),
    {
      message: /to have items/,
    },
    "empty array"
  );
});

test("config :: invalid object", (t) => {
  t.throws(
    () => validateConfig([undefined]),
    {
      message: /to be an object/,
    },
    "non-object"
  );
  t.throws(
    () => validateConfig([{}]),
    {
      message: /\.name to be a string/,
    },
    "no name property"
  );
  t.throws(
    () =>
      validateConfig([
        {
          name: "sup",
        },
      ]),
    {
      message: /\.url to be a string/,
    },
    "missing url property"
  );
  t.throws(
    () => validateConfig([{ name: "sup", url: "/bogus/stuff" }]),
    {
      message: /\.url to be a valid URL/,
    },
    "invalid URL"
  );
});
