#!/usr/bin/env node
import { promises as fs } from "fs";
import { isAbsolute, join } from "path";

import { main } from "./index";
import { isDirectory, isFile } from "./file";
import { exitWithError, toCamelCase } from "./util";

export type ArgMap = Record<string, boolean | string | null>;

export const parseArgs = (args: string[]) => {
  const argsMap: ArgMap = {};

  while (args.length) {
    const arg = args.shift();

    if (!arg) {
      continue;
    } else if (!arg.startsWith("--")) {
      argsMap[arg] = null;
      continue;
    }

    const key = toCamelCase(arg);

    if (!args[0] || args[0].startsWith("--")) {
      argsMap[key] = true;
    } else {
      argsMap[key] = args.shift()!;
    }
  }

  return argsMap;
};

export const cli = async (args: ArgMap) => {
  if ("help" in args) {
    console.log(`Usage:
    $ ./dist/cli <options>

  Options:
    --config  Path to JSON configuration
    --out-dir Path to output directory

  Example:
    $ ./dist/cli --config ./path/to/config.json --out-dir ./path/to/dir`);
  }

  if (!("config" in args)) {
    exitWithError("--config option is required");
  } else if (typeof args.config !== "string" || !args.config) {
    exitWithError("--config option should be a filename");
  } else if (!("outDir" in args)) {
    exitWithError("--out-dir option is required");
  } else if (typeof args.outDir !== "string" || !args.outDir) {
    exitWithError("--out-dir option should be a directory");
  }

  const outDir = isAbsolute(args.outDir as string)
    ? (args.outDir as string)
    : join(process.cwd(), args.outDir as string);

  if (!(await isDirectory(outDir))) {
    exitWithError(`--out-dir option is not a directory:

    ${outDir}`);
  }

  const configArg = isAbsolute(args.config as string)
    ? (args.config as string)
    : join(process.cwd(), args.config as string);

  if (!(await isFile(configArg))) {
    exitWithError(`--config option is not a file:

    ${configArg}`);
  }

  let configContent: any;

  try {
    configContent = await fs.readFile(configArg, {
      encoding: "utf-8",
    });
  } catch (e) {
    exitWithError(`Could not read content of config file:

    ${configArg}`);
  }

  let config: any;

  try {
    config = JSON.parse(configContent);
  } catch (error) {
    exitWithError(`Could not parse config file:

    ${error.message}`);
  }

  try {
    await main({ config, outDir });
  } catch (error) {
    exitWithError(`Error during run:

    ${error.message}`);
  }
};

if (process.env.NODE_ENV !== "test") {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  });

  cli(parseArgs(process.argv.slice(2)));
}
