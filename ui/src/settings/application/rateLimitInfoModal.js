import { __, __t } from "@/i18n";
export let basePredefinedTags = [
    { value: "*:list" },
    { value: "*:view" },
    { value: "*:create" },
    { value: "*:update" },
    { value: "*:delete" },
    { value: "*:file", description: __("targets the files download endpoint") },
    { value: "*:listAuthMethods" },
    { value: "*:authRefresh" },
    { value: "*:auth", description: __("targets all auth methods") },
    { value: "*:authWithPassword" },
    { value: "*:authWithOAuth2" },
    { value: "*:authWithOTP" },
    { value: "*:requestOTP" },
    { value: "*:requestPasswordReset" },
    { value: "*:confirmPasswordReset" },
    { value: "*:requestVerification" },
    { value: "*:confirmVerification" },
    { value: "*:requestEmailChange" },
    { value: "*:confirmEmailChange" },
];

export function openRateLimitInfoModal() {
    const modal = rateLimitInfoModal();

    document.body.appendChild(modal);

    app.modals.open(modal);
}

function rateLimitInfoModal() {
    return t.div(
        {
            pbEvent: "rateLimitInfoModal",
            className: "modal rate-limit-info-modal",
            onafterclose: (el) => {
                el?.remove();
            },
        },
        t.header({ className: "modal-header" }, t.h5(null, __("Rate limit label format"))),
        t.div(
            { className: "modal-content" },
            t.p(null, __("The rate limit rules are resolved in the following order (stops on the first match):")),
            t.ol(
                null,
                t.li(null, __("exact tag (e.g. "), t.code(null, "users:create")),
                t.li(null, __("wildcard tag (e.g. "), t.code(null, "*:create")),
                t.li(null, __("METHOD + exact path (e.g. "), t.code(null, "POST /a/b")),
                t.li(null, __("METHOD + prefix path (e.g. "), t.code(null, "POST /a/b", t.strong(null, "/"))),
                t.li(null, __("exact path (e.g. "), t.code(null, "/a/b")),
                t.li(null, __("prefix path (e.g. "), t.code(null, "/a/b", t.strong(null, "/"))),
            ),
            t.p(
                null,
                __t`In case of multiple rules with the same label but different target user audience (e.g. "guest" vs "auth"), only the matching audience rule is taken in consideration.`,
            ),
            t.hr(),
            t.p(null, __("The rate limit label could be in one of the following formats:")),
            t.ul(
                null,
                t.li(
                    { className: "m-b-sm" },
                    t.code(null, "[METHOD ]/my/path"),
                    __(" - full exact route match ("),
                    t.strong(null, __("must be without trailing slash")),
                    "; \"METHOD\" is optional).",
                    t.br(),
                    __("For example:"),
                    t.ul(
                        { className: "m-0" },
                        t.li(
                            null,
                            t.code(null, "/hello"),
                            __(" - matches "),
                            t.code(null, "GET /hello"),
                            __(", "),
                            t.code(null, "POST /hello"),
                            __(", etc."),
                        ),
                        t.li(null, t.code(null, "POST /hello"), __(" - matches only "), t.code(null, "POST /hello")),
                    ),
                ),
                t.li(
                    { className: "m-b-sm" },
                    t.code(null, "[METHOD ]/my/prefix", t.strong(null, "/")),
                    __(" - path prefix ("),
                    t.strong(null, "must end with trailing slash;"),
                    __("\"METHOD\" is optional). For example:"),
                    t.ul(
                        { className: "m-0" },
                        t.li(
                            null,
                            t.code(null, "/hello/"),
                            __(" - matches "),
                            t.code(null, "GET /hello"),
                            __(", "),
                            t.code(null, "POST /hello/a/b/c"),
                            __(", etc."),
                        ),
                        t.li(
                            null,
                            t.code(null, "POST /hello/"),
                            __(" - matches "),
                            t.code(null, "POST /hello"),
                            __(", "),
                            t.code(null, "POST /hello/a/b/c"),
                            __(", etc."),
                        ),
                    ),
                ),
                t.li(
                    { className: "m-b-0" },
                    t.code(null, "collectionName:predefinedTag"),
                    __(" - targets a specific action of a single collection."),
                    __(" To apply the rule for all collections you can use the "),
                    t.code(null, "*"),
                    __(" wildcard. For example:"),
                    t.code(null, "posts:create"),
                    __(", "),
                    t.code(null, "users:listAuthMethods"),
                    __(", "),
                    t.code(null, "*:auth"),
                    ".",
                    t.br(),
                    __("The predifined collection tags are ("),
                    t.em(null, __("there should be autocomplete once you start typing")),
                    "):",
                    t.ul({ className: "m-0" }, () => {
                        return basePredefinedTags.map((tag) => {
                            return t.li(null, tag.value.replace("*:", ":"), () => {
                                if (tag.description) {
                                    return t.em({ className: "txt-hint" }, " (", tag.description, ")");
                                }
                            });
                        });
                    }),
                ),
            ),
        ),
        t.footer(
            { className: "modal-footer" },
            t.button(
                {
                    type: "button",
                    className: "btn transparent m-r-auto",
                    onclick: () => app.modals.close(),
                },
                t.span({ className: "txt" }, __("Close")),
            ),
        ),
    );
}
