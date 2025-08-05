# Domu Agent Monitoring System

A real-time voice agent monitoring system consisting of two microservices that track and analyze voice interaction events.

## Architecture

- **Service A (Ingest)**: Event ingestion and metrics computation service
- **Service B (Simulator)**: Event generation and simulation service

## Service A Endpoints

### Base URL
[http://3.142.49.14:8080](http://3.142.49.14:8080)


### 1. POST /ingest
Ingests voice agent events for monitoring and analysis.

**URL**: `http://3.142.49.14:8080/ingest`

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sessionId": "abc123",
  "intent": "BookFlight",
  "latencyMs": 250,
  "success": true,
  "confidence": 0.95
}
```

**Response**:
```json
{
  "message": "Event ingested"
}
```

### 2. GET /metrics
Returns metrics in Prometheus format for monitoring dashboards.

**URL**: [http://3.142.49.14:8080/metrics](http://3.142.49.14:8080/metrics)

**Method**: `GET`

**Response** (text/plain):
```
voice_events_total 15
voice_latency_ms_avg 245.67
voice_error_rate 0.067
voice_confidence_avg 0.89
```

### 3. GET /report
Returns metrics in JSON format for API consumption.

**URL**: `http://3.142.49.14:8080/report`

**Method**: `GET`

**Response**:
```json
{
  "totalEvents": 15,
  "avgLatencyMs": 245.67,
  "errorRate": 0.067,
  "avgConfidence": 0.89
}
```

## Implementation Details & Approach

### Data Management Strategy
- **In-Memory Storage**: Events are stored in memory for fast access and real-time processing
- **Time-Based Cleanup**: Automatic cleanup of events older than 5 minutes to prevent memory bloat
- **Event Retention**: Keeps either the last 5 minutes of events OR the most recent 30 events (whichever is fewer)

### Event Validation
- Comprehensive payload validation ensuring all required fields are present
- Type checking for numeric fields (`latencyMs`, `confidence`) and boolean fields (`success`)
- Returns 400 Bad Request for invalid payloads with descriptive error messages

### Metrics Computation
- **Total Events**: Count of all events in the current window
- **Average Latency**: Mean response time across all events
- **Error Rate**: Percentage of failed interactions (1 - success_rate)
- **Average Confidence**: Mean confidence score across all events

### Prometheus Integration
- Metrics formatted according to Prometheus standards
- Fixed decimal precision for consistent monitoring
- Standard metric naming convention (`voice_*`)

## Challenges & Solutions

### 1. Memory Management
**Challenge**: In-memory storage could lead to unbounded memory growth
**Solution**: Implemented automatic cleanup with configurable retention policies

### 2. Real-Time Processing
**Challenge**: Need for immediate metric updates without database overhead
**Solution**: In-memory computation with efficient array operations

### 3. Data Consistency
**Challenge**: Ensuring metrics reflect current state accurately
**Solution**: Cleanup runs before every metrics computation

### 4. Error Handling
**Challenge**: Graceful handling of malformed requests
**Solution**: Comprehensive validation with clear error responses

## Optimizations & Error Handling

### Performance Optimizations
- **Efficient Array Operations**: Using `reduce()` and `filter()` for fast computation
- **Minimal Memory Footprint**: Automatic cleanup prevents memory leaks
- **Fast Response Times**: In-memory operations provide sub-millisecond response times

### Error Handling
- **Input Validation**: Comprehensive payload validation with type checking
- **Graceful Degradation**: System continues operating even with malformed requests
- **Clear Error Messages**: Descriptive error responses for debugging
- **Network Resilience**: Service B includes retry logic and error logging

### Monitoring & Observability
- **Prometheus Integration**: Standard metrics format for monitoring dashboards
- **Dual Output Formats**: Both Prometheus text and JSON for different use cases
- **Real-Time Updates**: Metrics reflect current state within the retention window

## Service B (Simulator) Features
> Note: Service is hosted on IPv4: 18.217.234.244

- **LLM-Powered Generation**: Uses Groq API to generate realistic voice events
- **Automatic Scheduling**: Sends events every 60 seconds
- **Error Resilience**: Continues operation even if individual events fail
- **Realistic Data**: Generates varied intents, latencies, and confidence scores

## Challenges: My First Experience with a Cloud Platform (AWS)

This was my first time working with any cloud service provider, and I chose AWS to deploy a two-service agent monitoring system using ECS Fargate.

Getting started wasn’t just about learning AWS services — it was about understanding how cloud infrastructure works. From Docker image compatibility and task definitions, to environment variables and service discovery, each part introduced its own learning curve.

I faced several hurdles like:

- Configuring ECS task definitions correctly  
- Managing Docker image versions and pushing to ECR  
- Debugging failing deployments due to cryptic errors  
- Figuring out how to access services publicly (similar to Cloud Run on GCP)
- Integrating all above services together

Every roadblock became a learning point, and by the end of it, I walked away with hands-on experience deploying, debugging, and scaling services on AWS for the first time.

### Time spent:
- Coding: 2.5 hrs
- AWS: 4 hrs


## Testing the System

1. **Manual Event Ingestion**:
   ```bash
   curl -X POST http://3.142.49.14:8080/ingest \
     -H "Content-Type: application/json" \
     -d '{"timestamp":"2024-01-15T10:30:00.000Z","sessionId":"test123","intent":"TestIntent","latencyMs":300,"success":true,"confidence":0.9}'
   ```
   >Note: Did a manual Event ingestion for August 10th, 2025 (future date), which would remain persistent for the remainder of testing process

2. **Check Metrics**:
   ```bash
   curl http://3.142.49.14:8080/metrics
   ```

3. **Get JSON Report**:
   ```bash
   curl http://3.142.49.14:8080/report
   ```

The system is designed for high-throughput, low-latency monitoring of voice agent interactions with robust error handling and efficient resource management.