import { __t } from "@/i18n";
import { __ } from "@/i18n";
export function docsEmailChange(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const actionTabs = [
        { title: __("Request email change"), content: request },
        { title: __("Confirm email change"), content: confirm },
    ];

    const data = store({
        activeActionIndex: 0,
    });

    return t.div(
        {
            pbEvent: "apiPreviewEmailChange",
            className: "content",
        },
        // description
        t.p(null, __t`Sends ${collection.name} email change request.`),
        t.p(
            null,
            __("On successful email change all previously issued auth tokens for the specific record will be invalidated (and the user will be marked as verified if not already)."),
        ),
        app.components.codeBlockTabs({
            className: "sdk-examples m-t-sm",
            historyKey: "pbLastSDK",
            tabs: [
                {
                    title: "JS SDK",
                    language: "js",
                    value: `
                        import PocketBase from 'pocketbase';

                        const pb = new PocketBase('${baseURL}');

                        ...

                        await pb.collection('${collection.name}').authWithPassword(
                          'test@example.com',
                          '1234567890'
                        );

                        await pb.collection('${collection.name}').requestEmailChange('new@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${collection.name}').confirmEmailChange(
                            'EMAIL_CHANGE_TOKEN',
                            'YOUR_PASSWORD',
                        );
                    `,
                    footnote: t.div(
                        { className: "txt-right" },
                        t.a({
                            href: import.meta.env.PB_JS_SDK_URL,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            textContent: __("JS SDK docs"),
                        }),
                    ),
                },
                {
                    title: "Dart SDK",
                    language: "dart",
                    value: `
                        import 'package:pocketbase/pocketbase.dart';

                        final pb = PocketBase('${baseURL}');

                        ...

                        await pb.collection('${collection.name}').authWithPassword(
                          'test@example.com',
                          '1234567890'
                        );

                        await pb.collection('${collection.name}').requestEmailChange('new@example.com');

                        // ---
                        // (optional) in your custom confirmation page:
                        // ---

                        // note: all previous user auth tokens will be invalidated
                        // (and the user will be marked as verified if not already)
                        await pb.collection('${collection.name}').confirmEmailChange(
                          'EMAIL_CHANGE_TOKEN',
                          'YOUR_PASSWORD',
                        );
                    `,
                    footnote: t.div(
                        { className: "txt-right" },
                        t.a({
                            href: import.meta.env.PB_DART_SDK_URL,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            textContent: __("Dart SDK docs"),
                        }),
                    ),
                },
                {
                    title: "curl",
                    language: "bash",
                    value: `
                        # Request email change
                        curl -X POST \\
                          -H 'Authorization:TOKEN' \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "newEmail":"..." }' \\
                          '${baseURL}/api/collections/${collection.name}/request-email-change'

                        # Confirm email change
                        #
                        # note: all previous user auth tokens will be invalidated
                        # (and the user will be marked as verified if not already)
                        curl -X POST \\
                          -H 'Content-Type:application/json' \\
                          -d '{ "token":"...", "password":"" }' \\
                          '${baseURL}/api/collections/${collection.name}/confirm-email-change'
                    `,
                },
            ],
        }),
        t.nav(
            { className: "btns m-t-base m-b-sm" },
            () => {
                return actionTabs.map((tab, i) => {
                    return t.button({
                        type: "button",
                        className: () => `btn sm expanded ${data.activeActionIndex == i ? "active" : "secondary"}`,
                        textContent: () => tab.title,
                        onclick: () => data.activeActionIndex = i,
                    });
                });
            },
        ),
        () => actionTabs[data.activeActionIndex]?.content?.(collection),
    );
}

function request(collection) {
    const responses = [
        {
            title: 204,
            value: "null",
        },
        {
            title: 400,
            value: `
                {
                  "status": 400,
                  "message": "An error occurred while validating the submitted data.",
                  "data": {
                    "newEmail": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `,
        },
        {
            title: 401,
            value: `
                {
                  "status": 401,
                  "message": "The request requires valid record authorization token to be set.",
                  "data": {}
                }
            `,
        },
        {
            title: 403,
            value: `
                {
                  "status": 403,
                  "message": "The authorized record model is not allowed to perform this action.",
                  "data": {}
                }
            `,
        },
    ];

    return [
        // api
        t.div({ className: "block" }, t.strong(null, __("API details"))),
        t.div(
            { className: "alert success api-preview-alert" },
            t.span({ className: "label method" }, "POST"),
            t.span({ className: "path" }, `/api/collections/${collection.name}/request-email-change`),
            t.small({ className: "extra" }, __("Requires"), t.br(), __("Authorization:TOKEN header")),
        ),
        t.table(
            { className: "api-preview-table body-params" },
            t.thead(
                null,
                t.tr(
                    null,
                    t.th({ className: "min-width txt-primary" }, __("Body params")),
                    t.th({ className: "min-width" }, __("Type")),
                    t.th(null, __("Description")),
                ),
            ),
            t.tbody(
                null,
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "newEmail ", t.em(null, __("(required)"))),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                    t.td(null, __("The new email address to send the change email request.")),
                ),
            ),
        ),
        // responses
        t.div({ className: "block m-t-base m-b-sm" }, t.strong(null, __("Example responses"))),
        app.components.codeBlockTabs({
            tabs: responses,
        }),
    ];
}

function confirm(collection) {
    const responses = [
        {
            title: 204,
            value: "null",
        },
        {
            title: 400,
            value: `
                {
                  "status": 400,
                  "message": "An error occurred while validating the submitted data.",
                  "data": {
                    "token": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `,
        },
    ];

    return [
        // api
        t.div({ className: "block" }, t.strong(null, __("API details"))),
        t.div(
            { className: "alert success api-preview-alert" },
            t.span({ className: "label method" }, "POST"),
            t.span({ className: "path" }, `/api/collections/${collection.name}/confirm-email-change`),
        ),
        t.table(
            { className: "api-preview-table body-params" },
            t.thead(
                null,
                t.tr(
                    null,
                    t.th({ className: "min-width txt-primary" }, __("Body params")),
                    t.th({ className: "min-width" }, __("Type")),
                    t.th(null, __("Description")),
                ),
            ),
            t.tbody(
                null,
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "token ", t.em(null, __("(required)"))),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                    t.td(null, __("The token from the change email request email.")),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "password ", t.em(null, __("(required)"))),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                    t.td(null, __("The account password to confirm the email change.")),
                ),
            ),
        ),
        // responses
        t.div({ className: "block m-t-base m-b-sm" }, t.strong(null, __("Example responses"))),
        app.components.codeBlockTabs({
            tabs: responses,
        }),
    ];
}
