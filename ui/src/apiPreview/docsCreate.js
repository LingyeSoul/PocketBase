import { __t } from "@/i18n";
import { __ } from "@/i18n";
import { expandInfo } from "./expandInfo";
import { fieldsInfo } from "./fieldsInfo";
import { filterSyntax } from "./filterSyntax";

export function docsCreate(collection) {
    const baseURL = app.utils.getApiExampleURL();

    const isSuperusersOnly = collection.createRule === null;

    const isAuth = collection.type === "auth";

    const excludedTableFields = isAuth ? ["password", "verified", "email", "emailVisibility"] : [];

    const tableFields =
        collection.fields?.filter((f) => !f.hidden && f.type != "autodate" && !excludedTableFields.includes(f.name))
        || [];

    const baseDummyRecord = {
        collectionId: collection.id,
        collectionName: collection.name,
    };

    const responses = [
        {
            title: 200,
            value: JSON.stringify(
                Object.assign(baseDummyRecord, app.utils.getDummyFieldsData(collection)),
                null,
                2,
            ),
        },
        {
            title: 400,
            value: `
                {
                  "status": 400,
                  "message": "Failed to create record.",
                  "data": {
                    "${isAuth ? "email" : tableFields.find((f) => !f.primaryKey)?.name || "someField"}": {
                      "code": "validation_required",
                      "message": "Missing required value."
                    }
                  }
                }
            `,
        },
    ];
    if (isSuperusersOnly) {
        responses.push({
            title: 403,
            value: `
                {
                  "status": 403,
                  "message": "Only superusers can perform this action.",
                  "data": {}
                }
            `,
        });
    }

    return t.div(
        { pbEvent: "apiPreviewCreate", className: "content" },
        // description
        t.p(null, __t`Creates a new ${collection.name} record.`),
        t.p(
            null,
            __("Body parameters could be sent as "),
            t.code(null, "application/json"),
            __(" or "),
            t.code(null, "multipart/form-data"),
            ".",
        ),
        t.p(
            null,
            __("File upload is supported only via "),
            t.code(null, "multipart/form-data"),
            __(". For more info and examples you could check the detailed "),
            t.a({
                href: import.meta.env.PB_FILE_UPLOAD_DOCS,
                target: "_blank",
                rel: "noopener noreferrer",
                textContent: __("Files upload and handling docs"),
            }),
            ".",
        ),
        app.components.codeBlockTabs({
            className: "sdk-examples m-t-sm",
            historyKey: "pbLastSDK",
            tabs: [
                {
                    title: "JS SDK",
                    language: "js",
                    // dprint-ignore
                    value: `
import PocketBase from 'pocketbase';

const pb = new PocketBase('${baseURL}');

...

// example create body
const body = ${replaceDummyPayloadPlaceholder(JSON.stringify(fullDummyPayload(collection), null, 2))};

const record = await pb.collection('${collection.name}').create(body);
`+ (isAuth ? `
// (optional) send an email verification request
await pb.collection('${collection?.name}').requestVerification(record.email);
` : ""),
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
                    // dprint-ignore
                    value: `
import 'package:pocketbase/pocketbase.dart';

final pb = PocketBase('${baseURL}');

...

// example create body
final body = <String, dynamic>${JSON.stringify(primitivesDummyPayload(collection), null, 2)};

final record = await pb.collection('${collection.name}').create(body: body, files: []);
` + (isAuth ? `
// (optional) send an email verification request
await pb.collection('${collection?.name}').requestVerification(
    record.get<String>('email'),
);
` : ""),
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
curl -X POST \\
  -H 'Authorization:TOKEN' \\
  -H 'Content-Type:application/json' \\
  -d '{ ... }' \\
  '${baseURL}/api/collections/${collection.name}/records'
` + (isAuth
                        ? `
# (optional) send an email verification request
curl -X POST \\
  -H 'Content-Type:application/json' \\
  -d '{ "email":"test@example.com" }' \\
  '${baseURL}/api/collections/${collection.name}/request-verification'
`
                        : ""),
                },
            ],
        }),
        // api
        t.div({ className: "block m-t-base" }, t.strong(null, __("API details"))),
        t.div(
            { className: "alert success api-preview-alert" },
            t.span({ className: "label method" }, "POST"),
            t.span({ className: "path" }, `/api/collections/${collection.name}/records`),
            () => {
                if (isSuperusersOnly) {
                    return t.small({ className: "extra" }, __("Requires superuser Authorization:TOKEN header"));
                }
            },
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
                () => {
                    if (!isAuth) {
                        return;
                    }

                    return [
                        t.tr(
                            null,
                            t.th(
                                { colSpan: 99 },
                                __("Auth specific fields"),
                            ),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "email ",
                                () => {
                                    if (collection.fields?.find((f) => f.name == "email")?.required) {
                                        return t.em(null, __("(required)"));
                                    }
                                    return t.em(null, __("(optional)"));
                                },
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                            t.td(null, __("Auth record email address.")),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "emailVisibility ",
                                () => {
                                    if (collection.fields?.find((f) => f.name == "emailVisibility")?.required) {
                                        return t.em(null, __("(required)"));
                                    }
                                    return t.em(null, __("(optional)"));
                                },
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, __("Boolean"))),
                            t.td(
                                null,
                                __("Whether to show/hide the auth record email when fetching the record data."),
                                t.br(),
                                __("Superusers and the owner of the record always have access to the email address."),
                            ),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "password ",
                                t.em(null, __("(required)")),
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                            t.td(null, __("Auth record password.")),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "passwordConfirm ",
                                t.em(null, __("(required)")),
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                            t.td(null, __("Auth record password confirmation.")),
                        ),
                        t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                "verified ",
                                t.em(null, __("(optional)")),
                            ),
                            t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                            t.td(
                                null,
                                t.p(null, __("Indicates whether the auth record is verified or not.")),
                                t.p(
                                    null,
                                    __t`This field can be set only by superusers or auth records with "Manage" access.`,
                                ),
                            ),
                        ),
                        t.tr(
                            null,
                            t.th(
                                { colSpan: 99 },
                                __("Other fields"),
                            ),
                        ),
                    ];
                },
                () => {
                    return tableFields.map((f) => {
                        return t.tr(
                            null,
                            t.td(
                                { className: "min-width" },
                                f.name,
                                t.em(null, f.required && !f.autogeneratePattern ? " (required)" : " (optional)"),
                            ),
                            t.td(
                                { className: "min-width" },
                                t.span(
                                    { className: "label" },
                                    () => {
                                        const dummyData = app.fieldTypes[f.type]?.dummyData(f, true);
                                        const dummyDataType = typeof dummyData;

                                        if (f.type == "file") return __("File");
                                        if (dummyDataType === "string") return __("String");
                                        if (dummyDataType == "number") return __("Number");
                                        if (dummyDataType == "bool") return __("Boolean");
                                        if (Array.isArray(dummyData)) return "Array";
                                        if (app.utils.isObject(dummyData)) return "Object";

                                        return "Mixed";
                                    },
                                ),
                            ),
                            t.td(
                                null,
                                t.code(null, f.type),
                                __(" field type value."),
                                t.br(),
                                t.small(
                                    { className: "txt-hint" },
                                    __("For more details you could check the "),
                                    t.a({
                                        href: import.meta.env.PB_FIELDS_DOCS,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        textContent: __("Fields docs"),
                                    }),
                                    ".",
                                ),
                            ),
                        );
                    });
                },
            ),
        ),
        t.table(
            { className: "api-preview-table query-params" },
            t.thead(
                null,
                t.tr(
                    null,
                    t.th({ className: "min-width txt-primary" }, __("?query params")),
                    t.th({ className: "min-width" }, __("Type")),
                    t.th(null, __("Description")),
                ),
            ),
            t.tbody(
                null,
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "expand"),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                    t.td(null, expandInfo()),
                ),
                t.tr(
                    null,
                    t.td({ className: "min-width" }, "fields"),
                    t.td({ className: "min-width" }, t.span({ className: "label" }, __("String"))),
                    t.td(null, fieldsInfo()),
                ),
            ),
        ),
        // responses
        t.div({ className: "block m-t-base m-b-sm" }, t.strong(null, __("Example responses"))),
        app.components.codeBlockTabs({
            tabs: responses,
        }),
    );
}

export function replaceDummyPayloadPlaceholder(payloadStr) {
    return payloadStr.replaceAll(`"[[`, "").replaceAll(`]]"`, "");
}

export function fullDummyPayload(collection, forUpdate = false) {
    let payload = app.utils.getDummyFieldsData(collection, true);

    delete payload.id;
    if (collection.type == "auth") {
        if (forUpdate) {
            payload.oldPassword = "987654321";
            delete payload.email;
        }

        payload.password = "123456789";
        payload.passwordConfirm = "123456789";

        delete payload.verified;
    }

    return payload;
}

export function primitivesDummyPayload(collection, forUpdate = false) {
    const payload = fullDummyPayload(collection, forUpdate);

    for (const prop in payload) {
        const type = typeof payload[prop];
        if (
            // placeholder
            payload[prop]?.startsWith?.("[[")
            // not a primitive
            || (!["number", "string", "boolean"].includes(type) && !Array.isArray(payload[prop]))
        ) {
            delete payload[prop];
        }
    }

    return payload;
}
