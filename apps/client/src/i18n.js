import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const loadTranslations = () => {
  const context = require.context('./locales', true, /\.json$/);
  const resources = {};

  context.keys().forEach((path) => {
    const [, lang, namespace] = path.match(/\.\/(.+)\/(.+)\.json$/);
    if (!resources[lang]) resources[lang] = {};
    resources[lang][namespace] = context(path);
  });

  return resources;
};

i18n.use(initReactI18next).init({
  resources: loadTranslations(),
  lng: 'en',
  fallbackLng: 'kr',
  interpolation: { escapeValue: false }
});

export default i18n;
