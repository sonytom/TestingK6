import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const BASE_URL = 'https://test.k6.io/';
const ACCESS_TOKEN = 'your_access_token_here'; // Put your actual access token here

export const options = {
    stages: [
            {
                duration: '10s',
                target: 200
            },
            {
                duration: '30s',
                target: 200
            },
            {
                duration: '10s',
                target: 0
            }
    ],
    thresholds: {
        http_req_duration: [
            'p(95)<200', 
            { threshold: 'max<200', tag: 'response-time-max-<=300ms' }, // Max response time <= 300ms tag
            { threshold: 'med<100', tag: 'response-time-med-<=100ms' }, // Median response time <= 300ms tag
            { threshold: 'min<50', tag: 'response-time-med-<=50ms' } // minimun response time <= 300ms tag
        ]
    }
};

export default function () {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    };

    const payload = JSON.stringify({
        key1: 'value1',
        key2: 'value2'
    });

    const response = http.post(BASE_URL, payload, { headers });

    check(response, {
        'status is 200': (r) => r.status === 200,
        'response time is <= 200ms': (r) => r.timings.duration <= 200
    });

    const responseTime = response.timings.duration;
    const dataSize = payload.length;
    const responseBodySize = response.body.length;

    // Log custom metrics
  //  logMetrics(responseTime, dataSize, responseBodySize);

    sleep(1);
}

// function logMetrics(responseTime, dataSize, responseBodySize) {
//     // You can do any additional logging or handling of metrics here
//     console.log(`Response Time: ${responseTime}ms | Data Size: ${dataSize} bytes | Response Body Size: ${responseBodySize} bytes`);
// }

export function handleSummary(data) {
    return {
        'HTML Report': htmlReport(data),
    };
}
