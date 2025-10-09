import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import { formalGermanMessages } from "@haleos/ra-language-german";
import englishMessagesCustom from "./en";
import germanMessagesCustom from "./de";
import merge from "lodash/merge";

const messages: { [key: string]: any } = {
  en: merge({}, englishMessages, englishMessagesCustom),
  de: merge({}, formalGermanMessages, germanMessagesCustom),
};

console.log(messages)


const detectBrowserLanguage = (): string => {
  if (typeof navigator === "undefined") {
    return "en"; // Default for server-side rendering
  }

  const storedLang = localStorage.getItem("locale");
  if (storedLang && (storedLang === "en" || storedLang === "de")) {
    return storedLang;
  }

  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang) {
    const lang = browserLang.split("-")[0];
    if (lang === "de") {
      return "de";
    }
  }

  return "en";
};

const defaultLocale = detectBrowserLanguage();

export const i18nProvider = polyglotI18nProvider(
  (locale) => {
    // Store user's language preference
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("locale", locale);
    }
    return messages[locale];
  },
  defaultLocale,
  [
    { locale: "en", name: "English" },
    { locale: "de", name: "Deutsch" },
  ]
);
