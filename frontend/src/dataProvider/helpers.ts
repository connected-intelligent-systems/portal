import * as jsonld from "jsonld";

export async function compactJsonLd(jsonLd: any, frame: any) {
  return jsonld.compact(jsonLd, frame);
}

export async function compactJsonLdArray(jsonLdArray: any[], frame: any) {
  const framedArray = [];
  for (const jsonLd of jsonLdArray) {
    framedArray.push(await jsonld.compact(jsonLd, frame));
  }
  return framedArray;
}

/**
 * Recursively removes `undefined` values from objects and arrays, preserving null and other types.
 */
export function removeUndefinedValues(value: any): any {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== "object" || value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.reduce((acc, item) => {
      const processed = removeUndefinedValues(item);
      if (processed !== undefined) acc.push(processed);
      return acc;
    }, []);
  }

  const result: any = {};
  for (const [key, val] of Object.entries(value)) {
    const processed = removeUndefinedValues(val);
    if (processed !== undefined) result[key] = processed;
  }
  return result;
}
