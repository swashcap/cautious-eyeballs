import { URL } from "url";

export const exitWithError = (...args: Parameters<typeof console.error>) => {
  console.error(...args);
  process.exit(1);
};

export const extToMime = new Map<string, string>([
  ["bmp", "image/bmp"],
  ["gif", "image/gif"],
  ["jpeg", "image/jpeg"],
  ["jpg", "image/jpeg"],
  ["json", "application/json"],
  ["png", "image/png"],
]);

export const getDate = (date: Date) => [
  date.getFullYear().toString(),
  date.getMonth() > 8
    ? (date.getMonth() + 1).toString()
    : `0${date.getMonth() + 1}`,
  date.getDate() > 9 ? date.getDate().toString() : `0${date.getDate()}`,
];

export const getTime = (date: Date) => [
  date.getHours() > 9 ? date.getHours().toString() : `0${date.getHours()}`,
  date.getMinutes() > 9
    ? date.getMinutes().toString()
    : `0${date.getMinutes()}`,
  date.getSeconds() > 9
    ? date.getSeconds().toString()
    : `0${date.getSeconds()}`,
];

export const getExt = (url: string | URL) =>
  typeof url === "string"
    ? url.match(/\.(\w+)(\?.*)?$/)?.[1].toLowerCase()
    : url.pathname.match(/\.(\w+)$/)?.[1].toLowerCase();

export const toCamelCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .replace(/[^A-Za-z0-9]([A-Za-z0-9])/g, (str) => str[1].toUpperCase());
