import context from "./td-context-1.1.json";
import * as jsonld from "jsonld";

/**
 * Replace all base URLs in href fields with the public EDC endpoint
 * Also replaces security definitions and security references with bearer token
 * Recursively traverses the JSON object and replaces href values
 */
export function replaceThingDescriptionHrefs(
  thingDescription: any,
  publicEdcEndpoint: string
): string {
  try {
    const replaceSecurityInObject = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(replaceSecurityInObject);
      } else if (obj !== null && typeof obj === "object") {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          // Skip securityDefinitions - will be replaced at root level
          if (key === "securityDefinitions") {
            continue;
          }
          // Replace security with bearer_sc
          else if (key === "security") {
            result[key] = "bearer_sc";
          }
          // Replace href values
          else if (key === "href" && typeof value === "string") {
            try {
              const originalUrl = new URL(value);
              const edcUrl = new URL(publicEdcEndpoint);

              // Combine EDC endpoint path with original path
              const edcPath = edcUrl.pathname.replace(/\/$/, "");
              const originalPath = originalUrl.pathname;
              const combinedPath = edcPath + originalPath;

              // Build the new URL with EDC origin + combined path
              const newUrl = new URL(combinedPath, edcUrl.origin);
              newUrl.search = originalUrl.search;
              newUrl.hash = originalUrl.hash;

              result[key] = newUrl.toString();
            } catch {
              // If URL parsing fails, keep original value
              result[key] = value;
            }
          } else {
            result[key] = replaceSecurityInObject(value);
          }
        }
        return result;
      }
      return obj;
    };

    const processedTd = replaceSecurityInObject(thingDescription);

    // Replace securityDefinitions at root level
    processedTd.securityDefinitions = {
      bearer_sc: {
        scheme: "bearer",
        in: "header",
      },
    };

    // Ensure root level has security set to bearer_sc
    processedTd.security = "bearer_sc";

    return processedTd;
  } catch (error) {
    // If parsing fails, return original string
    console.error("Failed to process thing description:", error);
    return thingDescription;
  }
}

export function replaceThingDescriptionContext(thingDescription: any): any {
  if (thingDescription["@context"]) {
    thingDescription["@context"] = context["@context"];
  }
  return thingDescription;
}

export async function compactThingDescription(
  thingDescription: any
): Promise<any> {
  // the context when returning from the edc is removed, so we need to add it twice (and compact)
  const compactedTd = await jsonld.compact(
    {
      ...thingDescription,
      "@context": context["@context"],
    },
    {
      "@context": context["@context"],
    }
  );

  // after compaction, ensure the context is set to the standard W3C TD context
  return {
    ...compactedTd,
    "@context": "https://www.w3.org/2022/wot/td/v1.1",
  };
}

export async function expandThingDescription(
  thingDescription: any
): Promise<any> {
  // the context when returning from the edc is removed, so we need to add it twice (and expand)
  const expandedTd = await jsonld.expand({
    ...thingDescription,
    "@context": context["@context"],
  });

  return expandedTd;
}
