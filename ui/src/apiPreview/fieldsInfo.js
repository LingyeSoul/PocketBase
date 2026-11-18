import { __ } from "@/i18n";
export function fieldsInfo() {
    return t.div(
        { className: "api-fields-info" },
        t.p(
            null,
            __("Comma separated string of the fields to return in the JSON response (by default returns all fields). For example:"),
        ),
        app.components.codeBlock({
            value:
                `// return all root level fields and only\n// "relField.someField" from expand\n?fields=*,expand.relField.someField`,
        }),
        t.p(null, __("Use "), t.code(null, "*"), __(" to target all keys from the specific depth level.")),
        t.p(null, __("In addition, the following field modifiers are also supported:")),
        t.ul(
            null,
            t.li(
                null,
                t.code(null, ":excerpt(maxLength, withEllipsis?)"),
                t.br(),
                __("Returns a short plain text version of the field string value. Ex.: "),
                t.code(null, "?fields=*,someTextField:excerpt(200,true)"),
            ),
        ),
    );
}
