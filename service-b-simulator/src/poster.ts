import axios from 'axios';
import dotenv from 'dotenv';
import { Event } from './llm';

dotenv.config();

const TARGET_URL = process.env.TARGET_URL;

export async function sendEventToIngest(event: Event): Promise<void> {
  if (!TARGET_URL) {
    console.error('🛑 TARGET_URL is not defined in .env');
    return;
  }

  try {
    const response = await axios.post(TARGET_URL, event, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ Event sent! Status: ${response.status}`);
  } catch (err: any) {
    console.error('🛑 Error sending to /ingest:', err.response?.data || err.message);
  }
}