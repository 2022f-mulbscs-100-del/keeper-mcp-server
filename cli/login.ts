import express, { type Request, type Response } from 'express';
import open from 'open';
import { saveTokens } from './tokenStore';


export async function login() {
  const app = express();
  const port = 3000;

  const frontendBaseUrl = process.env.KEEP_FRONTEND_URL ?? 'https://keeper04.netlify.app';
  
  const callbackBaseUrl =
    process.env.KEEP_LOGIN_CALLBACK_BASE_URL ?? `http://localhost:${port}`;

  const server = app.listen(port, () => {
    console.log('Opening browser for login...');
    const loginUrl = new URL('/login', frontendBaseUrl);
    loginUrl.searchParams.set('redirect', `${callbackBaseUrl}/callback`);
    void open(loginUrl.toString());
  });

  app.get('/callback', (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.query as {
      accessToken: string;
      refreshToken: string;
    };

    if (!accessToken || !refreshToken) {
      res.send('Login failed — missing tokens.');
      server.close(() => process.exit(1));
      return;
    }

    saveTokens(accessToken, refreshToken);
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