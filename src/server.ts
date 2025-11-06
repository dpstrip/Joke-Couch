import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './db';
import swaggerUi from 'swagger-ui-express';
import openapi from './openapi.json';

dotenv.config();

const app = express();
app.use(express.json());

// Serve API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi as any));

// Redirect root to docs
app.get('/', (_req, res) => res.redirect('/docs'));

const port = Number(process.env.PORT || 3000);

let db: any;

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/jokes', async (_req, res) => {
  try {
    const r = await db.list({ include_docs: true });
    const docs = (r.rows || []).map((r2: any) => r2.doc).filter(Boolean);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch jokes', details: String(err) });
  }
});

app.get('/jokes/:id', async (req, res) => {
  try {
    const doc = await db.get(req.params.id);
    res.json(doc);
  } catch (err: any) {
    if (err && err.statusCode === 404) {
      res.status(404).json({ error: 'not found' });
    } else {
      res.status(500).json({ error: 'failed to fetch', details: String(err) });
    }
  }
});

app.post('/jokes', async (req, res) => {
  try {
    const data = req.body || {};
    data.createdAt = new Date().toISOString();
    const insert = await db.insert(data);
    res.status(201).json(insert);
  } catch (err) {
    res.status(500).json({ error: 'failed to insert', details: String(err) });
  }
});

async function start() {
  try {
    db = await initDB('jokes');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
}

start();
