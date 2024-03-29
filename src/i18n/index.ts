import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import translation_en from './en.json'
import translation_zh from './zh.json'

const resources = {
  en: {
    translation: translation_en
  },
  zh: {
    translation: translation_zh
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // 默认语言 zh/en
    lng: 'zh',
    interpolation: {
      escapeValue: true
    }
  })

export default i18n
