import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.MODEL || 'llama3-8b-8192';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export type Event = {
  timestamp: string;
  sessionId: string;
  intent: string;
  latencyMs: number;
  success: boolean;
  confidence: number;
};

export async function generateFakeEvent(): Promise<Event | null> {
  const prompt = `
Generate a single realistic JSON object representing a voice agent monitoring event with the following keys:
- timestamp (ISO string)
- sessionId (random short alphanumeric)
- intent (like BookFlight, CancelOrder, TrackPackage)
- latencyMs (number between 50–1000)
- success (boolean)
- confidence (number between 0.5 and 1)

ONLY return the JSON, no explanation or extra text.
`;

  try {
    const response = await axios.post(API_URL, {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      }
    });

    const content = response.data.choices[0]?.message?.content?.trim();

    if (!content) {
      console.error('⚠️ No content returned from LLM.');
      return null;
    }

    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    const cleaned = content.slice(jsonStart, jsonEnd + 1);
    const parsed: Event = JSON.parse(cleaned);    
    parsed.timestamp = new Date().toISOString();
    return parsed;

  } catch (err: any) {
    console.error('🛑 LLM error:', err.response?.data || err.message);
    return null;
  }
}