"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
const jsx_runtime_1 = require("hono/jsx/jsx-runtime");
function Header() {
    return ((0, jsx_runtime_1.jsx)("header", { class: "site-header", children: (0, jsx_runtime_1.jsx)("div", { class: "container", children: (0, jsx_runtime_1.jsx)("a", { class: "brand", href: "/", children: "AgentClinic" }) }) }));
}
