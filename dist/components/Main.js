"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = Main;
const jsx_runtime_1 = require("hono/jsx/jsx-runtime");
function Main({ children }) {
    return (0, jsx_runtime_1.jsx)("main", { class: "site-main container", children: children });
}
