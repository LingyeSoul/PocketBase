import { __ } from "@/i18n";
export function filterSyntax() {
    const data = store({
        show: false,
    });

    return t.div(
        { className: "filter-details m-t-10" },
        t.button(
            {
                type: "button",
                className: "btn secondary sm",
                onclick: () => data.show = !data.show,
            },
            () => {
                if (data.show) {
                    return [
                        t.span({ className: "txt" }, __("Hide details")),
                        t.i({ className: "ri-arrow-up-s-line", ariaHidden: true }),
                    ];
                }

                return [
                    t.span({ className: "txt" }, __("Show details")),
                    t.i({ className: "ri-arrow-down-s-line", ariaHidden: true }),
                ];
            },
        ),
        app.components.slide(
            () => data.show,
            t.div(
                { className: "block p-t-5" },
                t.p(
                    null,
                    __("The filter syntax follows the format "),
                    t.code(
                        null,
                        t.span({ className: "txt-success" }, "OPERAND"),
                        t.span({ className: "txt-danger" }, " OPERATOR "),
                        t.span({ className: "txt-success" }, "OPERAND"),
                    ),
                    __(", where:"),
                ),
                t.ul(
                    null,
                    t.li(
                        null,
                        t.span({ className: "txt-code txt-success" }, "OPERAND"),
                        __(" could be any of the above field literal, function, string (single or double quoted), number, null, true, false"),
                    ),
                    t.li(
                        null,
                        t.span({ className: "txt-code txt-danger" }, "OPERATOR"),
                        __(" is one of:"),
                        t.ul(
                            null,
                            t.li(null, t.code({ className: "filter-op" }, "="), __(" Equal")),
                            t.li(null, t.code({ className: "filter-op" }, "!="), __(" Not equal")),
                            t.li(null, t.code({ className: "filter-op" }, ">"), __(" Greater than")),
                            t.li(null, t.code({ className: "filter-op" }, ">="), __(" Greater than or equal")),
                            t.li(null, t.code({ className: "filter-op" }, "<"), __(" Less than")),
                            t.li(null, t.code({ className: "filter-op" }, "<="), __(" Less than or equal")),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "~"),
                                __(" Like/Contains"),
                                t.div(
                                    { className: "txt-sm txt-hint" },
                                    t.em(
                                        null,
                                        __("(auto wraps the right string OPERAND in a \"%\" for wildcard match if not explicitly set)"),
                                    ),
                                ),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "!~"),
                                __(" NOT Like/Contains"),
                                t.div(
                                    { className: "txt-sm txt-hint" },
                                    t.em(
                                        null,
                                        __("(auto wraps the right string OPERAND in a \"%\" for wildcard match if not explicitly set)"),
                                    ),
                                ),
                            ),
                            // any/at-least-one-of
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?="),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Equal"),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?!="),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Not equal"),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?>"),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Greater than"),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?>="),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Greater than or equal"),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?<"),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Less than"),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?<="),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Less than or equal"),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?~"),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" Like/Contains"),
                                t.div(
                                    { className: "txt-sm txt-hint" },
                                    t.em(
                                        null,
                                        __("(auto wraps the right string OPERAND in a \"%\" for wildcard match if not explicitly set)"),
                                    ),
                                ),
                            ),
                            t.li(
                                null,
                                t.code({ className: "filter-op" }, "?!~"),
                                t.span({ className: "txt-hint" }, __(" Any/At-least-one-of")),
                                __(" NOT Like/Contains"),
                                t.div(
                                    { className: "txt-sm txt-hint" },
                                    t.em(
                                        null,
                                        __("(auto wraps the right string OPERAND in a \"%\" for wildcard match if not explicitly set)"),
                                    ),
                                ),
                            ),
                        ),
                        t.p(
                            null,
                            __("To group and combine several expressions you could use brackets "),
                            t.code(null, "(...)"),
                            __(", "),
                            t.code(null, "&&"),
                            __(", (AND) and "),
                            t.code(null, "||"),
                            " (OR) tokens.",
                        ),
                    ),
                ),
            ),
        ),
    );
}
