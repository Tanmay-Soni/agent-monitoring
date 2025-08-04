import { generateFakeEvent } from './llm';
import { sendEventToIngest } from './poster';

async function simulateEvent() {
  const event = await generateFakeEvent();

  if (event) {
    await sendEventToIngest(event);
  } else {
    console.error('⚠️ Skipping POST — failed to generate event');
  }
}

// Initial fire, then every 60s
simulateEvent();
setInterval(simulateEvent, 60 * 1000);
