"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = Home;
const jsx_runtime_1 = require("hono/jsx/jsx-runtime");
const Layout_1 = require("../components/Layout");
function Home() {
    return ((0, jsx_runtime_1.jsx)(Layout_1.Layout, { title: "AgentClinic", children: (0, jsx_runtime_1.jsxs)("section", { class: "home", children: [(0, jsx_runtime_1.jsx)("h1", { children: "AgentClinic" }), (0, jsx_runtime_1.jsx)("p", { children: "A dependable clinic where agents report issues and recover quickly." })] }) }));
}
