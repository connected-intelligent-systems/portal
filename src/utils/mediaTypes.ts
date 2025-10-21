import { DEFAULT_MEDIA_TYPES, type MediaTypeConfig } from "../config";

export function getMediaTypes(): MediaTypeConfig[] {
  return window.config?.mediaTypes || DEFAULT_MEDIA_TYPES;
}

export function getMediaTypeIds(): string[] {
  return getMediaTypes().map((mt) => mt.id);
}

export function getMediaTypeTranslations(
  locale: string
): Record<string, string> {
  const mediaTypes = getMediaTypes();
  const translations: Record<string, string> = {};

  mediaTypes.forEach((mt) => {
    const lang = locale === "de" ? "de" : "en";
    const key = mt.id.replace(/\//g, "_").replace(/[.-]/g, "_");
    translations[key] = mt.translations[lang];
  });

  return translations;
}

export function getMediaTypeChoices(
  locale: string
): Array<{ id: string; name: string }> {
  const mediaTypes = getMediaTypes();
  const lang = locale === "de" ? "de" : "en";

  return mediaTypes.map((mt) => ({
    id: mt.id,
    name: mt.translations[lang],
  }));
}
