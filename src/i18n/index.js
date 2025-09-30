import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enError from "./en/error.json";
import enSuccess from "./en/success.json";

import viError from "./vi/error.json";
import viSuccess from "./vi/success.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { 
      error: enError, 
      success: enSuccess 
    },
    vi: { 
      error: viError, 
      success: viSuccess 
    },
  },
  lng: "vi",
  fallbackLng: "en",
  ns: ["error", "success"],  // phải khai báo namespace ở đây
  defaultNS: "success",      // namespace mặc định (tùy chọn)
  interpolation: { escapeValue: false },
});


export default i18n;
