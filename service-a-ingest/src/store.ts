type Event = {
    timestamp: Date;
    sessionId: string;
    intent: string;
    latencyMs: number;
    success: boolean;
    confidence: number;
  };
  
  const events: Event[] = [];
  
  /**
   * Adds a new event to the in-memory store.
   */
  export function addEvent(event: Event): void {
    events.push(event);
    cleanupOldEvents();
  }
  
  /**
   * Returns filtered events — those that are either:
   * - Within the last 5 minutes, OR
   * - The most recent 30 events (whichever is fewer)
   */
  export function getEvents(): Event[] {
    cleanupOldEvents();
  
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentTimeEvents = events.filter(e => e.timestamp.getTime() >= fiveMinutesAgo);
  
    return recentTimeEvents.length < 30
      ? recentTimeEvents
      : events.slice(-30); // return last 30 events
  }
  
  /**
   * Removes old events (older than 5 mins) from the front of the array.
   */
  function cleanupOldEvents(): void {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    while (events.length && events[0].timestamp.getTime() < fiveMinutesAgo) {
      events.shift();
    }
  }
  