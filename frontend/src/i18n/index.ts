import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import germanMessages from "ra-language-german";
import englishMessagesCustom from "./en";
import germanMessagesCustom from "./de";

const messages: { [key: string]: any } = {
  en: { ...englishMessages, ...englishMessagesCustom },
  de: { ...germanMessages, ...germanMessagesCustom }, // fallback to English for base messages
};

// Function to detect browser language
const detectBrowserLanguage = (): string => {
  if (typeof navigator === "undefined") {
    return "en"; // Default for server-side rendering
  }

  // Check localStorage first for user preference
  const storedLang = localStorage.getItem("locale");
  if (storedLang && (storedLang === "en" || storedLang === "de")) {
    return storedLang;
  }

  // Detect browser language
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang) {
    const lang = browserLang.split("-")[0]; // Get primary language (e.g., 'en' from 'en-US')
    if (lang === "de") {
      return "de";
    }
  }

  return "en"; // Default fallback
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
