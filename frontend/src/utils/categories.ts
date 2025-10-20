import { DEFAULT_CATEGORIES, type CategoryConfig } from "../config";

export function getCategories(): CategoryConfig[] {
  return window.config?.categories || DEFAULT_CATEGORIES;
}

export function getCategoryIds(): string[] {
  return getCategories().map((cat) => cat.id);
}

export function getCategoryTranslations(
  locale: string
): Record<string, string> {
  const categories = getCategories();
  const translations: Record<string, string> = {};

  categories.forEach((cat) => {
    const lang = locale === "de" ? "de" : "en";
    translations[cat.id.toLowerCase()] = cat.translations[lang];
  });

  return translations;
}

export function getCategoryChoices(
  locale: string
): Array<{ id: string; name: string }> {
  const categories = getCategories();
  const lang = locale === "de" ? "de" : "en";

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.translations[lang],
  }));
}
