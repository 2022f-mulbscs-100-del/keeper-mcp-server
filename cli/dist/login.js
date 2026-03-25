"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const express_1 = __importDefault(require("express"));
const open_1 = __importDefault(require("open"));
const tokenStore_1 = require("./tokenStore");
async function login() {
    const app = (0, express_1.default)();
    const port = 3000;
    const frontendBaseUrl = process.env.KEEP_FRONTEND_URL ?? 'http://localhost:5173';
    const callbackBaseUrl = process.env.KEEP_LOGIN_CALLBACK_BASE_URL ?? `http://localhost:${port}`;
    const server = app.listen(port, () => {
        console.log('Opening browser for login...');
        const loginUrl = new URL('/login', frontendBaseUrl);
        loginUrl.searchParams.set('redirect', `${callbackBaseUrl}/callback`);
        void (0, open_1.default)(loginUrl.toString());
    });
    app.get('/callback', (req, res) => {
        const { accessToken, refreshToken } = req.query;
        if (!accessToken || !refreshToken) {
            res.send('Login failed — missing tokens.');
            server.close(() => process.exit(1));
            return;
        }
        (0, tokenStore_1.saveTokens)(accessToken, refreshToken);
        console.log('✅ Tokens saved!');
        console.log('');
        console.log('Next step: run  keep cursor-setup  to configure Cursor.');
        res.send(`
      <h2>Login successful!</h2>
      <p>You can close this tab and return to your terminal.</p>
    `);
        server.close(() => process.exit(0));
    });
}
