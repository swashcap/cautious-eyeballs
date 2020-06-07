import { createWriteStream, promises as fs } from "fs";
import { Readable } from "stream";

export const isDirectory = async (path: string) => {
  try {
    const stats = await fs.stat(path);

    return stats.isDirectory();
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    return false;
  }
};

export const isFile = async (filename: string) => {
  try {
    const stats = await fs.stat(filename);

    return stats.isFile();
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    return false;
  }
};

export const writeMessage = (filename: string, message: Readable) =>
  new Promise((resolve, reject) => {
    const write = createWriteStream(filename)
      .on("error", reject)
      .on("finish", resolve);

    message.pipe(write);
  });
