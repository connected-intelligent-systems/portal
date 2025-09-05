import { z } from "zod";

// A generic type for any resource that has a properties bag
export type CoreResource = {
  properties?: Record<string, unknown>;
  [key: string]: unknown;
};

/**
 * Safely extracts a string value from a resource's properties.
 * @param data The core resource object.
 * @param key The key of the property to extract (e.g., 'dct:title').
 * @returns The string value or undefined if not found or not a string.
 */
export function extractString(
  data: CoreResource,
  key: string
): string | undefined {
  const result = z.string().safeParse(data.properties?.[key]);
  return result.success ? result.data : undefined;
}

/**
 * Safely extracts a value that could be a single string or an array of strings,
 * and normalizes it into an array of strings.
 * @param data The core resource object.
 * @param key The key of the property to extract.
 * @returns An array of strings, or undefined if not found.
 */
export function normalizeStringArray(
  data: CoreResource,
  key: string
): string[] | undefined {
  const keywords = data.properties?.[key];
  const arraySchema = z.array(z.string());
  const stringSchema = z.string();

  const arrayResult = arraySchema.safeParse(keywords);
  if (arrayResult.success) {
    return arrayResult.data;
  }

  const stringResult = stringSchema.safeParse(keywords);
  if (stringResult.success) {
    return [stringResult.data];
  }

  return undefined;
}
