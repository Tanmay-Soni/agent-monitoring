import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { addEvent, getEvents } from './store';
import { computeMetrics, formatPrometheusMetrics } from './metrics';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

app.get('/', (_req, res) => {
    res.send('Service A is running!');
  });

// POST /ingest
app.post('/ingest', (req, res) => {
  console.log('📥 Received event:', req.body);
  const { timestamp, sessionId, intent, latencyMs, success, confidence } = req.body;

  if (
    !timestamp || !sessionId || !intent ||
    typeof latencyMs !== 'number' ||
    typeof success !== 'boolean' ||
    typeof confidence !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  addEvent({ timestamp: new Date(timestamp), sessionId, intent, latencyMs, success, confidence });
  res.status(200).json({ message: 'Event ingested' });
});

// GET /metrics
app.get('/metrics', (_req, res) => {
  const metrics = computeMetrics(getEvents());
  const textOutput = formatPrometheusMetrics(metrics);
  res.type('text/plain').send(textOutput);
});

// GET /report
app.get('/report', (_req, res) => {
  const metrics = computeMetrics(getEvents());
  res.json(metrics);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

