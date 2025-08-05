import axios from 'axios';
import { Event } from './llm';

export async function sendEventToIngest(event: Event): Promise<void> {
  const TARGET_URL = 'http://3.142.49.14:8080/ingest';

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
