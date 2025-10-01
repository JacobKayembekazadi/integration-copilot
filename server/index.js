// Lightweight Express proxy to keep Gemini API key server-side.
// In production, harden with rate limiting, input validation, and auth.
/* eslint-env node */
/* global process, console */
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.warn('[proxy] GEMINI_API_KEY not set – requests will fail.');
}

// POST /api/integrate
// Body: { prompt: string, history?: [{role, content}], apiType: string, preferredModel?: string }
app.post('/api/generate', async (req, res) => {
  const { prompt, history = [], apiType, preferredModel } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  const modelCandidates = preferredModel ? [preferredModel] : ['gemini-2.5-flash', 'gemini-2.5-pro'];

  let selectedModel = null;
  for (const m of modelCandidates) {
    try {
      const meta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}?key=${GEMINI_KEY}`);
      if (meta.ok) { selectedModel = m; break; }
    } catch { /* ignore and try next */ }
  }
  if (!selectedModel) {
    return res.status(502).json({ error: 'No accessible model' });
  }

  const conversation = history
    .map(h => `${h.role.toUpperCase()}: ${h.content}`)
    .join('\n');

  const fullPrompt = `You are an expert logistics integration assistant. Provide ONLY a JSON with keys pythonCode,nodeCode,sampleData,nextSteps. Platform: ${apiType}. History:\n${conversation}\nUSER:${prompt}`;

  try {
    const genResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
    });
    const data = await genResp.json();
    if (!genResp.ok) {
      return res.status(genResp.status).json({ error: data });
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.json({ raw: text, model: selectedModel });
  } catch (e) {
    return res.status(500).json({ error: (e && e.message) || 'Unknown error' });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`[proxy] listening on :${port}`);
});
