import * as http from "http";
import { URL } from "url";

import { getExt, extToMime } from "./util";

/**
 * A `Promise` wrapper over `http.get` with some mime-type awareness.
 * {@link https://nodejs.org/api/http.html#http_http_get_options_callback}
 */
export const get = (url: string | URL): Promise<http.IncomingMessage> =>
  new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      headers: {
        "cache-control": "max-age=0",
      },
      timeout: 5000,
    };

    const ext = getExt(url);
    const accepts = ext && extToMime.has(ext) ? extToMime.get(ext) : null;

    if (accepts) {
      options.headers!.accepts = accepts;
    }

    http
      .get(url, options, (res) => {
        let error;

        if (res.statusCode !== 200) {
          error = new Error(
            `Request failed with status code: ${res.statusCode}`
          );
        } else if (accepts && res.headers["content-type"] !== accepts) {
          error = new Error(
            `Invalid content type: Expected ${accepts}, received ${res.headers["content-type"]}`
          );
        }

        if (error) {
          reject(error);
          return res.resume();
        }

        resolve(res);
      })
      .on("error", reject);
  });
