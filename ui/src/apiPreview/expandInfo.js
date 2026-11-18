import { __ } from "@/i18n";
export function expandInfo() {
    return t.div(
        { className: "api-expand-info" },
        t.p(null, __("Auto expand record relations. For example:")),
        app.components.codeBlock({
            value: `?expand=relField1,relField2.subRelField`,
        }),
        t.p(
            null,
            __("Supports up to 6-levels depth nested relations expansion."),
            t.br(),
            __("The expanded relations will be appended to each individual record under the "),
            t.code(null, "expand"),
            __(" property (eg. "),
            t.code(null, `"expand": {"relField1": {...}, ...}`),
            ").",
        ),
        t.p(
            null,
            __("Only the relations to which the request user has permissions to "),
            t.strong(null, "view"),
            __(" will be expanded."),
        ),
    );
}
