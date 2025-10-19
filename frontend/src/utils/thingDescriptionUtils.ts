import context from "./td-context-1.1.json";
import * as jsonld from "jsonld";

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
          if (key === "securityDefinitions") {
            continue;
          } else if (key === "security") {
            result[key] = "bearer_sc";
          } else if (key === "href" && typeof value === "string") {
            try {
              const originalUrl = new URL(value);
              const edcUrl = new URL(publicEdcEndpoint);
              const edcPath = edcUrl.pathname.replace(/\/$/, "");
              const originalPath = originalUrl.pathname;
              const combinedPath = edcPath + originalPath;
              const newUrl = new URL(combinedPath, edcUrl.origin);
              newUrl.search = originalUrl.search;
              newUrl.hash = originalUrl.hash;

              result[key] = newUrl.toString();
            } catch {
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

    processedTd.securityDefinitions = {
      bearer_sc: {
        scheme: "bearer",
        in: "header",
      },
    };

    processedTd.security = "bearer_sc";

    return processedTd;
  } catch (error) {
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
  const compactedTd = await jsonld.compact(
    {
      ...thingDescription,
      "@context": context["@context"],
    },
    {
      "@context": context["@context"],
    }
  );

  return {
    ...compactedTd,
    "@context": "https://www.w3.org/2022/wot/td/v1.1",
  };
}

export async function expandThingDescription(
  thingDescription: any
): Promise<any> {
  const expandedTd = await jsonld.expand({
    ...thingDescription,
    "@context": context["@context"],
  });

  return expandedTd;
}
