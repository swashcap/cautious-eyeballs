import { promisify } from "util";

export interface RetryOptions {
  duration?: number;
  times?: number;
}

export const retry = async <T = any>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> => {
  const duration = options?.duration ?? 5000;
  const times = options?.times ?? 3;

  try {
    return await fn();
  } catch (error) {
    if (times <= 0) {
      throw error;
    }

    promisify(setTimeout)(duration);

    return await retry(fn, { times: times - 1 });
  }
};
