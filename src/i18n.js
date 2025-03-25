// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ملفات الترجمة
import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";

// الموارد (الترجمات)
const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

// تهيئة i18next
i18n
  .use(LanguageDetector) // للكشف التلقائي عن اللغة
  .use(initReactI18next) // لربط i18next مع React
  .init({
    resources,
    fallbackLng: "en", // اللغة الافتراضية
    interpolation: {
      escapeValue: false, // لا نحتاج إلى تهريب القيم
    },
  });

export default i18n;