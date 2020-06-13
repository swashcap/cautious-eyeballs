import test from "ava";
import { URL } from "url";

import * as util from "../dist/util.js";

test("getDate", (t) => {
  t.deepEqual(util.getDate(new Date(2019, 0, 1)), ["2019", "01", "01"]);
  t.deepEqual(util.getDate(new Date(2020, 11, 21)), ["2020", "12", "21"]);
});

test("getTime", (t) => {
  t.deepEqual(util.getTime(new Date(2019, 0, 1, 2, 3, 4)), ["02", "03", "04"]);
  t.deepEqual(util.getTime(new Date(2020, 11, 21, 22, 23, 24)), [
    "22",
    "23",
    "24",
  ]);
});

test("getExt", (t) => {
  t.is(
    util.getExt("https://very.secure.com/but/this/image.jpg?has=naughties"),
    "jpg"
  );
  t.is(
    util.getExt(
      new URL("https://some.website.net/verily/absent/of.gif?s=true")
    ),
    "gif"
  );
  t.is(util.getExt("https://whoa.is/it/image/time.JPEG"), "jpeg");
});

test("toCamelCase", (t) => {
  t.is(util.toCamelCase("sup bros"), "supBros");
  t.is(util.toCamelCase("--who-is-it"), "whoIsIt");
});
