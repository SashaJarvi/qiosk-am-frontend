import i18n from "@/i18n";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

interface IUserLocale {
  locale: string;
  localeNoRegion: string;
}

const Trans = {
  get defaultLocale() {
    return import.meta.env.VITE_DEFAULT_LOCALE;
  },
  get supportedLocales() {
    return import.meta.env.VITE_SUPPORTED_LOCALES.split(",");
  },
  get currentLocale() {
    return i18n.global.locale.value;
  },
  set currentLocale(newLocale: string) {
    i18n.global.locale.value = newLocale;
  },
  isLocaleSupported(locale: string) {
    return Trans.supportedLocales.includes(locale);
  },
  getUserLocale(): IUserLocale {
    // @ts-ignore
    const locale = window.navigator.language || window.navigator.userLanguage || Trans.defaultLocale;
    return {
      locale: locale,
      localeNoRegion: locale.split("-")[0],
    };
  },
  getPersistedLocale() {
    const persistedLocale = localStorage.getItem("user-locale");
    if (Trans.isLocaleSupported(persistedLocale as string)) {
      return persistedLocale;
    } else {
      return null;
    }
  },
  guessDefaultLocale() {
    const userPersistedLocale = Trans.getPersistedLocale();
    if (userPersistedLocale) {
      return userPersistedLocale;
    }
    const userPreferredLocale = Trans.getUserLocale();
    if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale;
    }
    if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion;
    }

    return Trans.defaultLocale;
  },
  // @ts-ignore
  i18nRoute(to) {
    return {
      ...to,
      params: {
        locale: Trans.currentLocale,
        ...to.params,
      },
    };
  },
  async switchLanguage(newLocale: string) {
    Trans.currentLocale = newLocale;
    (document.querySelector("html") as HTMLElement).setAttribute("lang", newLocale);
    localStorage.setItem("user-locale", newLocale);
  },
  async routeMiddleware(to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) {
    const paramLocale = to.params.locale;
    if (!Trans.isLocaleSupported(paramLocale as string)) {
      return next(Trans.guessDefaultLocale());
    }
    await Trans.switchLanguage(paramLocale as string);
    return next();
  },
};
export default Trans;
