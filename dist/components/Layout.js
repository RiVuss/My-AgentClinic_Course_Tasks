"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = Layout;
const jsx_runtime_1 = require("hono/jsx/jsx-runtime");
const Footer_1 = require("./Footer");
const Header_1 = require("./Header");
const Main_1 = require("./Main");
function Layout({ title = 'AgentClinic', children }) {
    return ((0, jsx_runtime_1.jsxs)("html", { lang: "en", children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: "UTF-8" }), (0, jsx_runtime_1.jsx)("meta", { content: "width=device-width, initial-scale=1.0", name: "viewport" }), (0, jsx_runtime_1.jsx)("title", { children: title }), (0, jsx_runtime_1.jsx)("link", { href: "/static/style.css", rel: "stylesheet" })] }), (0, jsx_runtime_1.jsxs)("body", { children: [(0, jsx_runtime_1.jsx)(Header_1.Header, {}), (0, jsx_runtime_1.jsx)(Main_1.Main, { children: children }), (0, jsx_runtime_1.jsx)(Footer_1.Footer, {})] })] }));
}
