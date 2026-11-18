import { __, __t } from "@/i18n";
window.app = window.app || {};
window.app.oauth2 = window.app.oauth2 || {};

// note: data is the providerSettingsModal form store
window.app.oauth2.microsoft = function(providerInfo, namePrefix, data) {
    const uniqueId = "microsoft_" + app.utils.randomString();

    const idTokenEmailClaimOptions = [
        {
            value: "",
            selected: __t`Graph API "mail" field (default)`,
            label: () => {
                return t.div(
                    { className: "option-content" },
                    t.strong(null, "Graph API ", t.code(null, "mail"), __(" field (default)")),
                    t.br(),
                    t.small(
                        { className: "txt-hint" },
                        __t`Extracts the "mail" field from the Graph API /me endpoint (this is a historical default and it is generally accepted to be safe in controlled/single-tenant AD setup).`,
                    ),
                );
            },
        },
        {
            value: "email",
            selected: __t`"email" id_token claim`,
            label: () => {
                return t.div(
                    { className: "option-content" },
                    t.strong(null, t.code(null, "email"), __(" id_token claim")),
                    t.br(),
                    t.small(
                        { className: "txt-hint" },
                        __t`Extracts the "email" token field (since ~2023 by default Microsoft populates it only if the email is considered verified, unless manually configured otherwise).`,
                    ),
                );
            },
        },
        {
            value: "email_and_xms_edov",
            selected: __t`"email" + "xms_edov" id_token claims`,
            label: () => {
                return t.div(
                    { className: "option-content" },
                    t.strong(null, t.code(null, "email"), " + ", t.code(null, "xms_edov"), __(" id_token claims")),
                    t.br(),
                    t.small(
                        { className: "txt-hint" },
                        __t`Extracts the "email" token field but also checks if the domain owner has been verified.`,
                    ),
                );
            },
        },
        {
            value: "verified_primary_email",
            selected: __t`"verified_primary_email" id_token claim`,
            label: () => {
                return t.div(
                    { className: "option-content" },
                    t.strong(null, t.code(null, "verified_primary_email"), __(" id_token claim")),
                    t.br(),
                    t.small(
                        { className: "txt-hint" },
                        __t`Extracts the configured user's "PrimaryAuthoritativeEmail" attribute value.`,
                    ),
                );
            },
        },
        {
            value: "any_verified",
            selected: __t`Either "verified_primary_email" OR "email" + "xms_edov" id_token claims`,
            label: () => {
                return t.div(
                    { className: "option-content" },
                    t.strong(
                        null,
                        __("Either "),
                        t.code(null, "verified_primary_email"),
                        __(" OR "),
                        t.code(null, "email"),
                        " + ",
                        t.code(null, "xms_edov"),
                        __(" id_token claims"),
                    ),
                    t.br(),
                    t.small({ className: "txt-hint" }, __("Extracts the first nonempty value from the two options.")),
                );
            },
        },
    ];

    return t.div(
        { pbEvent: "oauth2MicrosoftOptions", className: "oauth2-microsoft-options" },
        t.p({ className: "txt-bold" }, "Azure AD / Entra ID"),
        t.div(
            { className: "grid" },
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".authURL" }, __("Auth URL")),
                    t.input({
                        id: uniqueId + ".authURL",
                        name: namePrefix + ".authURL",
                        type: "url",
                        required: true,
                        value: () => data.config.authURL || "",
                        oninput: (e) => data.config.authURL = e.target.value,
                    }),
                ),
                t.div(
                    { className: "field-help" },
                    __("Ex. https://login.microsoftonline.com/YOUR_DIRECTORY_TENANT_ID/oauth2/v2.0/authorize"),
                ),
            ),
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".tokenURL" }, __("Token URL")),
                    t.input({
                        id: uniqueId + ".tokenURL",
                        name: namePrefix + ".tokenURL",
                        type: "url",
                        required: true,
                        value: () => data.config.tokenURL || "",
                        oninput: (e) => data.config.tokenURL = e.target.value,
                    }),
                ),
                t.div(
                    { className: "field-help" },
                    __("Ex. https://login.microsoftonline.com/YOUR_DIRECTORY_TENANT_ID/oauth2/v2.0/token"),
                ),
            ),
            t.div(
                { className: "col-12" },
                t.div(
                    { className: "field" },
                    t.label({ htmlFor: uniqueId + ".extra.idTokenEmailClaim" }, __("Extract email from")),
                    app.components.select({
                        id: uniqueId + ".extra.idTokenEmailClaim",
                        options: idTokenEmailClaimOptions,
                        value: () => data.config.extra?.idTokenEmailClaim || "",
                        onchange: (selectedOpts) => {
                            data.config.extra = data.config.extra || {};
                            data.config.extra.idTokenEmailClaim = selectedOpts[0]?.value;
                        },
                    }),
                ),
                t.div(
                    { className: "field-help" },
                    t.p(null, __("The default minimal required scopes are: "), t.code(null, "User.Read"), () => {
                        if (data.config.extra?.idTokenEmailClaim) {
                            return [__(" and "), t.code(null, "openid"), " (for the id_token)"];
                        }
                    }, "."),
                    t.p(
                        null,
                        __("Any optional claim such as "),
                        t.code(null, "email"),
                        __(" may need to be explicitly allowed depending on your tenant setup."),
                    ),
                ),
            ),
        ),
    );
};
