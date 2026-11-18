import { __ } from "@/i18n";
import { languageLinks } from "@/base/languagePicker";

export function pageRequestSuperuserPasswordReset(route) {
    app.store.title = __("Forgotten superuser password");

    const data = store({
        email: "",
        isSubmitting: false,
        success: false,
    });

    async function submit() {
        if (data.isSubmitting) {
            return;
        }

        data.isSubmitting = true;

        try {
            await app.pb.collection("_superusers").requestPasswordReset(data.email);
            data.success = true;
        } catch (err) {
            app.checkApiError(err);
        }

        data.isSubmitting = false;
    }

    return t.div(
        {
            pbEvent: "pageSuperuserPasswordReset",
            className: "wrapper sm m-auto p-b-base",
        },
        languageLinks(),
        t.header(
            { className: "txt-center m-b-base" },
            t.img({ className: "main-logo", src: () => app.store.mainLogo, ariaHidden: true, alt: __("App logo") }),
            t.h5({ className: "m-t-10" }, () => app.store.title),
        ),
        () => {
            if (data.success) {
                return t.div(
                    { pbEvent: "superuserPasswordResetAlert", className: "alert success txt-center" },
                    t.p(null, __("Check "), t.strong(null, data.email), __(" for the recovery link!")),
                );
            }

            return t.form(
                {
                    pbEvent: "superuserPasswordResetForm",
                    className: "grid request-password-reset-form",
                    onsubmit: (e) => {
                        e.preventDefault();
                        submit();
                    },
                },
                t.div(
                    { className: "col-12" },
                    t.div(
                        { className: "content txt-center m-b-sm" },
                        t.p(null, __("Enter the email associated with your account and we'll send you a recovery link:")),
                    ),
                    t.div(
                        { className: "field" },
                        t.label({ htmlFor: "password_reset_email" }, __("Email")),
                        t.input({
                            id: "password_reset_email",
                            name: "email",
                            type: "email",
                            required: true,
                            autofocus: true,
                            value: () => data.email,
                            oninput: (e) => (data.email = e.target.value),
                        }),
                    ),
                ),
                t.div(
                    { className: "col-12" },
                    t.button(
                        {
                            className: () => `btn lg block ${data.isSubmitting ? "loading" : ""}`,
                            disabled: () => data.isSubmitting,
                        },
                        t.i({ className: "ri-mail-send-line", ariaHidden: true }),
                        t.span({ className: "txt" }, __("Send recovery link")),
                    ),
                ),
            );
        },
        t.div(
            { className: "block m-t-sm txt-center" },
            t.a({ href: "#/login", className: "link-hint" }, __("Back to login")),
        ),
    );
}
