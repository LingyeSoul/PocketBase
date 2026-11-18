import { __ } from "@/i18n";
import { input } from "./input";
import { settings } from "./settings";
import { view } from "./view";

window.app = window.app || {};
window.app.fieldTypes = window.app.fieldTypes || {};
window.app.fieldTypes.date = {
    icon: "ri-calendar-line",
    label: __("Datetime"),
    settings,
    input,
    view,
    dummyData: (f, forSubmit = false) => {
        return new Date().toISOString().replaceAll("T", " ");
    },
};
