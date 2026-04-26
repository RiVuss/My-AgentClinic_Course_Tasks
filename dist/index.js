"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("hono/jsx/jsx-runtime");
const node_server_1 = require("@hono/node-server");
const serve_static_1 = require("@hono/node-server/serve-static");
const hono_1 = require("hono");
const Home_1 = require("./pages/Home");
const app = new hono_1.Hono();
app.use('/static/*', (0, serve_static_1.serveStatic)({ root: './' }));
app.get('/', (c) => c.html((0, jsx_runtime_1.jsx)(Home_1.Home, {})));
const port = 3000;
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`AgentClinic listening on http://localhost:${info.port}`);
});
exports.default = app;
