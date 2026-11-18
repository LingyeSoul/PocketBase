import { __ } from "@/i18n";
import { settings } from "./settings";

window.app = window.app || {};
window.app.fieldTypes = window.app.fieldTypes || {};
window.app.fieldTypes.password = {
    icon: "ri-lock-password-line",
    label: __("Password"),
    settings,
};
