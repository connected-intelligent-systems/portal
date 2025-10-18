/**
 * Replace all base URLs in href fields with the public EDC endpoint
 * Also replaces security definitions and security references with bearer token
 * Recursively traverses the JSON object and replaces href values
 */
export function replaceThingDescriptionHrefs(
  thingDescriptionStr: string,
  publicEdcEndpoint: string
): string {
  try {
    const td = JSON.parse(thingDescriptionStr);

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

    const processedTd = replaceSecurityInObject(td);

    // Replace securityDefinitions at root level
    processedTd.securityDefinitions = {
      bearer_sc: {
        scheme: "bearer",
        in: "header",
      },
    };

    // Ensure root level has security set to bearer_sc
    processedTd.security = "bearer_sc";

    return JSON.stringify(processedTd);
  } catch (error) {
    // If parsing fails, return original string
    console.error("Failed to process thing description:", error);
    return thingDescriptionStr;
  }
}
