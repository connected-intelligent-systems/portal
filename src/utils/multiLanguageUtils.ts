import { MultiLanguageValue } from "../dataProvider/shared/transformerHelpers";

export function getMultiLanguageValue(
  value: string | MultiLanguageValue[] | undefined,
  locale?: string
): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "";

    if (locale) {
      const match = value.find((v) => v.language === locale);
      if (match) return match.value;

      const languagePrefix = locale.split("-")[0];
      const prefixMatch = value.find((v) =>
        v.language?.startsWith(languagePrefix)
      );
      if (prefixMatch) return prefixMatch.value;
    }

    return value[0].value;
  }

  return "";
}

export function getTitleValue(
  titles: MultiLanguageValue[] | undefined,
  title: string | undefined,
  locale?: string
): string {
  if (titles && titles.length > 0) {
    return getMultiLanguageValue(titles, locale);
  }
  return title || "";
}

export function getAbstractValue(
  abstracts: MultiLanguageValue[] | undefined,
  abstract: string | undefined,
  locale?: string
): string {
  if (abstracts && abstracts.length > 0) {
    return getMultiLanguageValue(abstracts, locale);
  }
  return abstract || "";
}
