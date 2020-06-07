import { join } from "path";
import { promises as fs } from "fs";

import { validateConfig } from "./config";
import { getDate, getTime, getExt } from "./util";
import { get } from "./network";
import { writeMessage } from "./file";

/**
 * 1. Validate configuration
 * 2. Make directories
 * 3. Request + write assets
 */
export const main = async ({
  config,
  outDir,
}: {
  config: any;
  outDir: string;
}) => {
  validateConfig(config);

  const date = new Date();
  const prefix = join(...getDate(date));

  await Promise.all(
    config.map(({ name }) =>
      fs.mkdir(join(outDir, name, prefix), { recursive: true })
    )
  );

  await Promise.all(
    config.map(async ({ name, url }) => {
      const ext = getExt(url);
      const incomingMessage = await get(url);

      await writeMessage(
        join(outDir, name, prefix, `${getTime(date).join("")}.${ext}`),
        incomingMessage
      );
    })
  );
};
