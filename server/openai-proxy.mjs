import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });

const PORT = process.env.API_PORT || 3001;
const SYSTEM_PROMPT = `You are the in-app help assistant for a Task Manager web app built with Angular.
Topics: using the app (login, register, todos, filters, search), and brief Angular tips for this project.
Rules: Reply in exactly 3 to 50 words. One short paragraph only. No lists unless essential. Be friendly and practical.`;

function trimToWordLimit(text, maxWords = 50) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return text.trim();
  }
  return words.slice(0, maxWords).join(' ') + '…';
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, configured: !!process.env.OPENAI_API_KEY });
});

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env',
    });
  }

  const userMessages = req.body?.messages;
  if (!Array.isArray(userMessages) || userMessages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...userMessages
      .filter((m) => m?.role === 'user' || m?.role === 'assistant')
      .slice(-12)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 500) })),
  ];

  try {
    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        max_tokens: 120,
        temperature: 0.6,
      }),
    });

    const data = await openAiRes.json();

    if (!openAiRes.ok) {
      const msg = data?.error?.message || 'OpenAI request failed';
      return res.status(openAiRes.status).json({ error: msg });
    }

    const raw = data?.choices?.[0]?.message?.content?.trim() || 'Sorry, no response.';
    const reply = trimToWordLimit(raw, 50);

    res.json({ reply });
  } catch (err) {
    console.error('OpenAI proxy error:', err);
    res.status(500).json({ error: 'Failed to reach OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI proxy running at http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY is missing in .env');
  }
});
