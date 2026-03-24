import * as express from 'express';
import { type Request, type Response } from 'express';
import open from 'open';
import { saveTokens } from './tokenStore';

export async function login() {
  const app = express();
  const port = 3000;

  const server = app.listen(port, () => {
    console.log('Opening browser for login...');
    // Replace with your actual frontend URL
    void open(`http://localhost:5173/login?redirect=http://localhost:${port}/callback`);
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