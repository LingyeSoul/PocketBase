import zhCN from "./zh-CN";

const STORAGE_KEY = "pbLanguage";
const DEFAULT_LOCALE = "en";

export const supportedLocales = [
    { value: "en", label: "English" },
    { value: "zh-CN", label: "中文" },
];

const dictionaries = {
    "zh-CN": zhCN,
};

function isSupportedLocale(locale) {
    return supportedLocales.some((item) => item.value == locale);
}

function detectLocale() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(stored)) {
        return stored;
    }

    const browserLocales = window.navigator.languages?.length
        ? window.navigator.languages
        : [window.navigator.language];

    for (const locale of browserLocales) {
        if (locale?.toLowerCase().startsWith("zh")) {
            return "zh-CN";
        }
    }

    return DEFAULT_LOCALE;
}

let activeLocale = detectLocale();

if (activeLocale != DEFAULT_LOCALE) {
    document.documentElement.lang = activeLocale;
}

/**
 * Returns the active locale identifier (e.g. "en", "zh-CN").
 *
 * @return {string}
 */
export function getLocale() {
    return activeLocale;
}

/**
 * Persists the locale and reloads the page so that all module-level
 * translations are re-evaluated with the new dictionary.
 *
 * @param {string} locale
 */
export function setLocale(locale) {
    if (!isSupportedLocale(locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
    }

    if (locale == activeLocale) {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, locale);
    window.location.reload();
}

/**
 * Translates a static english string. Unknown strings are returned as-is.
 *
 * @param  {string} text
 * @return {string}
 */
export function __(text) {
    const dictionary = dictionaries[activeLocale];
    const translation = dictionary?.[text];
    return typeof translation == "string" ? translation : text;
}

/**
 * Tagged template helper for dynamic strings.
 *
 * Translation keys use `${}` for the expression placeholders and translations
 * may reference them with `{0}`, `{1}`, etc.
 *
 * @param  {Array<string>} strings
 * @param  {...any} values
 * @return {string}
 */
export function __t(strings, ...values) {
    let fallback = "";
    for (let i = 0; i < strings.length; i++) {
        fallback += strings[i];
        if (i < values.length) {
            fallback += values[i];
        }
    }

    const key = strings.join("${}");
    const dictionary = dictionaries[activeLocale];
    const translation = dictionary?.[key];
    if (typeof translation != "string") {
        return fallback;
    }

    return translation.replace(/\{(\d+)\}/g, (match, index) => {
        const value = values[Number(index)];
        return typeof value == "undefined" ? match : String(value);
    });
}

window.app = window.app || {};
window.app.i18n = {
    get locale() {
        return activeLocale;
    },
    supportedLocales,
    getLocale,
    setLocale,
    t: __,
};
