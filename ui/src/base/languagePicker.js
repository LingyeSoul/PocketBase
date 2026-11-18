import { __, getLocale, setLocale, supportedLocales } from "@/i18n";

function selectLocale(locale) {
    setLocale(locale);
}

/**
 * Header dropdown language picker.
 *
 * @return {Array<Element>}
 */
export function languageDropdown() {
    return [
        t.button(
            {
                type: "button",
                className: "header-link language-picker-button",
                title: __("Language"),
                "html-popovertarget": "language-dropdown",
            },
            t.i({ className: "ri-translate-2", ariaHidden: true }),
        ),
        t.div(
            {
                id: "language-dropdown",
                className: "dropdown sm nowrap language-dropdown",
                popover: "auto",
            },
            () => {
                return supportedLocales.map((locale) => {
                    return t.button(
                        {
                            type: "button",
                            className: () =>
                                `dropdown-item dropdown-item-language ${
                                    getLocale() == locale.value ? "active" : ""
                                }`,
                            onclick: (e) => {
                                e.target.closest(".dropdown").hidePopover();
                                selectLocale(locale.value);
                            },
                        },
                        t.i({ className: "ri-translate-2", ariaHidden: true }),
                        t.span({ className: "txt" }, locale.label),
                    );
                });
            },
        ),
    ];
}

/**
 * Compact inline language switcher for standalone auth pages.
 *
 * @return {Element}
 */
export function languageLinks() {
    return t.div(
        { className: "language-links" },
        t.i({ className: "ri-translate-2", ariaHidden: true }),
        () => {
            return supportedLocales.map((locale) => {
                return t.button(
                    {
                        type: "button",
                        className: () => `link-hint ${getLocale() == locale.value ? "active" : ""}`,
                        disabled: () => getLocale() == locale.value,
                        onclick: () => selectLocale(locale.value),
                    },
                    locale.label,
                );
            });
        },
    );
}
