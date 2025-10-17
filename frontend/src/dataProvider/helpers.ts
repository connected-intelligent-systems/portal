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

/**
 * Convenience wrapper that preserves the input type when stripping undefined entries.
 */
export function stripUndefinedValues<T>(value: T): T {
  return removeUndefinedValues(value) as T;
}

/**
 * Converts react-admin params to EDC QuerySpec format
 *
 * @param params - react-admin params containing pagination, sort, and filter
 * @param filterMapping - optional mapping function to convert filter field names
 * @returns EDC QuerySpec object
 *
 * @example
 * const querySpec = buildQuerySpec({
 *   pagination: { page: 2, perPage: 10 },
 *   sort: { field: 'name', order: 'ASC' },
 *   filter: { title: 'test', type: 'HttpData' }
 * });
 * // Returns:
 * // {
 * //   "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
 * //   "@type": "QuerySpec",
 * //   offset: 10,
 * //   limit: 10,
 * //   sortField: "name",
 * //   sortOrder: "ASC",
 * //   filterExpression: [
 * //     { operandLeft: "title", operator: "=", operandRight: "test" },
 * //     { operandLeft: "type", operator: "=", operandRight: "HttpData" }
 * //   ]
 * // }
 */
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
export function buildQuerySpec(
  params: {
    pagination?: { page: number; perPage: number };
    sort?: { field: string; order: string };
    filter?: Record<string, any>;
  },
  filterMapping?: (
    _field: string,
    _value: any
  ) => { field: string; operator: string; value: any } | null // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
): any {
  const { pagination, sort, filter } = params;

  // Build QuerySpec base structure
  const querySpec: any = {
    "@context": {
      "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
    },
    "@type": "QuerySpec",
  };

  // Add pagination
  if (pagination) {
    const { page = 1, perPage = 10 } = pagination;
    querySpec.offset = (page - 1) * perPage;
    querySpec.limit = perPage;
  }

  // Add sorting
  if (sort && sort.field) {
    querySpec.sortField = sort.field;
    querySpec.sortOrder = sort.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
  }

  // Add filters
  const filterExpression: any[] = [];
  if (filter) {
    for (const [filterKey, filterValue] of Object.entries(filter)) {
      // Skip empty values
      if (
        filterValue === undefined ||
        filterValue === null ||
        filterValue === ""
      ) {
        continue;
      }

      // Handle special 'q' search param (general search)
      if (filterKey === "q") {
        // Skip 'q' in filterExpression as it's typically handled server-side differently
        // or you can add multiple criteria for different fields
        continue;
      }

      // Use custom mapping if provided
      if (filterMapping) {
        const mapped = filterMapping(filterKey, filterValue);
        if (mapped) {
          filterExpression.push({
            operandLeft: mapped.field,
            operator: mapped.operator,
            operandRight: mapped.value,
          });
        }
        continue;
      }

      // Default behavior: direct equality comparison
      filterExpression.push({
        operandLeft: filterKey,
        operator: "=",
        operandRight: filterValue,
      });
    }
  }

  querySpec.filterExpression = filterExpression;

  return removeUndefinedValues(querySpec);
}
/* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars */
