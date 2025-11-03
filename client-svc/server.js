// client-svc/server.js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  const rid = req.get('X-Request-ID') || 'none';
  res.set('X-Request-ID', rid);
  console.log(`[client-svc] ${req.method} ${req.url} rid=${rid}`);
  next();
});

app.get('/', (_req, res) => res.json({ service: 'client', ok: true, ts: Date.now() }));
app.get('/cache/promo', (_req, res) => res.json({ promo: 'BLACK-FRIDAY', ts: Date.now() }));
app.get('/health', (_req, res) => res.send('OK'));

app.listen(5001, () => console.log('client-svc on 5001'));
