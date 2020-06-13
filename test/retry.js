import test from "ava";

import { retry } from "../dist/retry.js";

const makeMock = (implementation) => {
  const calls = [];

  return {
    calls,
    fn: (...args) => {
      calls[calls.length] = args;
      return implementation(...args);
    },
  };
};

test("retry :: succeed once", async (t) => {
  const value = "If at first you...succeed";
  const mock = makeMock(() => Promise.resolve(value));

  const response = await retry(mock.fn);

  t.is(mock.calls.length, 1, "calls fn once");
  t.is(response, value, "returns fn value");
});

test("retry :: retry once", async (t) => {
  const mock = makeMock(() => Promise.reject(new Error("Oh, no!")));

  const error = await t.throwsAsync(() => retry(mock.fn, { times: 1 }));

  t.is(error.message, "Oh, no!");
  t.is(mock.calls.length, 2, "calls fn once");
});

test("retry :: fail first", async (t) => {
  let calls = 0;

  await retry(() =>
    ++calls > 1 ? Promise.resolve() : Promise.reject(new Error())
  );

  t.is(calls, 2, "stops retry after success");
});
