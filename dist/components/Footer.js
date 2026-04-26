"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = Footer;
const jsx_runtime_1 = require("hono/jsx/jsx-runtime");
function Footer() {
    const year = new Date().getFullYear();
    return ((0, jsx_runtime_1.jsx)("footer", { class: "site-footer", children: (0, jsx_runtime_1.jsx)("div", { class: "container", children: (0, jsx_runtime_1.jsxs)("small", { children: ["\u00A9 ", year, " AgentClinic"] }) }) }));
}
