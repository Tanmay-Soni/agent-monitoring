type Event = {
    timestamp: Date;
    sessionId: string;
    intent: string;
    latencyMs: number;
    success: boolean;
    confidence: number;
  };
  
  type Metrics = {
    totalEvents: number;
    avgLatencyMs: number;
    errorRate: number;
    avgConfidence: number;
  };
  
  /**
   * Compute metrics from a given list of events.
   */
  export function computeMetrics(events: Event[]): Metrics {
    const totalEvents = events.length;
  
    if (totalEvents === 0) {
      return {
        totalEvents: 0,
        avgLatencyMs: 0,
        errorRate: 0,
        avgConfidence: 0,
      };
    }
  
    const totalLatency = events.reduce((sum, e) => sum + e.latencyMs, 0);
    const totalConfidence = events.reduce((sum, e) => sum + e.confidence, 0);
    const successCount = events.filter(e => e.success).length;
  
    return {
      totalEvents,
      avgLatencyMs: totalLatency / totalEvents,
      errorRate: 1 - successCount / totalEvents,
      avgConfidence: totalConfidence / totalEvents,
    };
  }
  
  /**
   * Convert metrics object to Prometheus-style plaintext format.
   */
  export function formatPrometheusMetrics(metrics: Metrics): string {
    return [
      `voice_events_total ${metrics.totalEvents}`,
      `voice_latency_ms_avg ${metrics.avgLatencyMs.toFixed(2)}`,
      `voice_error_rate ${metrics.errorRate.toFixed(3)}`,
      `voice_confidence_avg ${metrics.avgConfidence.toFixed(2)}`,
    ].join('\n');
  }
  