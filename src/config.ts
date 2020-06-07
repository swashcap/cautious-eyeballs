import { URL } from "url";

export type Config = ReadonlyArray<
  Readonly<{
    name: string;
    url: string;
  }>
>;

export function validateConfig(config: any): asserts config is Config {
  if (!Array.isArray(config)) {
    throw new Error("Expected config to be an array");
  } else if (config.length < 1) {
    throw new Error("Expected config to have items");
  }

  config.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Expected config item ${index} to be an object`);
    } else if (typeof item.name !== "string" || !item.name) {
      throw new Error(`Expected config item ${index} .name to be a string`);
    } else if (typeof item.url !== "string" || !item.url) {
      throw new Error(`Expected config item ${index} .url to be a string`);
    }

    try {
      new URL(item.url);
    } catch (e) {
      throw new Error(`Expected config item ${index} .url to be a valid URL`);
    }
  });
}
