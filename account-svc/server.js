// account-svc/server.js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  const rid = req.get('X-Request-ID') || 'none';
  res.set('X-Request-ID', rid);
  console.log(`[account-svc] ${req.method} ${req.url} rid=${rid}`);
  next();
});

app.get('/', (_req, res) => res.json({ service: 'account', ok: true, ts: Date.now() }));
app.get('/slow', async (_req, res) => {
  await new Promise(r => setTimeout(r, 4000));   // simulate slow backend (4s)
  res.json({ service: 'account', slow: true, ts: Date.now() });
});
app.get('/error', (_req, res) => {
  res.status(503).json({ service: 'account', error: 'temporary', ts: Date.now() });
});
app.get('/health', (_req, res) => res.send('OK'));

app.listen(5002, () => console.log('account-svc on 5002'));
