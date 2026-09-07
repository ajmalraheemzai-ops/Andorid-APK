import express from 'express';
import cors from 'cors';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Assistant endpoint
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback if no API key provided in container
      return res.json({
        reply: `### 🤖 Android AI Assistant (Offline Mode)
I noticed the \`GEMINI_API_KEY\` is not currently configured.
Here is what I see in your synced data:
- **Pending Tasks:** ${context?.tasks?.filter((t: any) => !t.completed)?.length || 0}
- **Logged Workouts:** ${context?.workouts?.length || 0}
- **Water Log:** ${context?.dailyStats?.waterGlasses || 0} / 8 glasses

To enable real-time Gemini generation, configure \`GEMINI_API_KEY\` in your environment settings.`,
      });
    }

    const systemInstruction = `You are a concise, high-efficiency personal productivity and fitness coach embedded inside an Android Todo & Fitness app.
Current User Context:
- Current Date/Time: ${new Date().toLocaleString()}
- Active Tasks: ${JSON.stringify(context?.tasks?.slice(0, 10) || [])}
- Workouts: ${JSON.stringify(context?.workouts?.slice(0, 8) || [])}
- Daily Stats: ${JSON.stringify(context?.dailyStats || {})}

Guidelines:
1. Provide punchy, actionable guidance tailored to the user's logged tasks and physical workouts.
2. Use clean markdown styling (headings, bullet points, bold highlights) without overly long intros.
3. Be encouraging, realistic, and focused on sustainable daily discipline and recovery.
4. Keep answers under 180 words unless the user explicitly requests an in-depth breakdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (err: any) {
    console.error('Error generating AI response:', err);
    res.status(500).json({
      error: 'Failed to generate response',
      details: err?.message || 'Internal server error',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
