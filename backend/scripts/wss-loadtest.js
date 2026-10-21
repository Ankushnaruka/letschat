#!/usr/bin/env node

import WebSocket from 'ws';
import { performance } from 'node:perf_hooks';

const CONFIG = {
  url: 'ws://localhost:3000',

  // JWT access token
  token: process.env.ACCESS_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YWI4Y2M1YjRhYzcxNDA4NThhZjJmZjMiLCJ1c2VybmFtZSI6ImFua3VzaHRlc3QyIiwiaWF0IjoxNzkwNTExMDk4LCJleHAiOjE3OTA1MTE5OTh9.TDJvRRiKVWiQf08UjqPTxR6lTOiWAyDXB9UxkOVoUAw",

  // Existing room in your database
  roomId: process.env.ROOM_ID || "6ab8cc844ac7140858af2ff8",

  connections: 50,

  // Messages each connection sends
  messagesPerConnection: 10,

  // Delay between messages
  messageIntervalMs: 100,

  connectionTimeoutMs: 10_000,

  testDurationMs: 30_000,
};

if (!CONFIG.token) {
  console.error('Missing ACCESS_TOKEN');
  console.error('PowerShell:');
  console.error('$env:ACCESS_TOKEN="your-token"');
  process.exit(1);
}

if (!CONFIG.roomId) {
  console.error('Missing ROOM_ID');
  console.error('PowerShell:');
  console.error('$env:ROOM_ID="your-room-id"');
  process.exit(1);
}

let connected = 0;
let connectionFailures = 0;

let messagesSent = 0;
let messagesReceived = 0;

const latencies = [];

const sockets = [];
const pendingMessages = new Map();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function percentile(values, p) {
  if (!values.length) return 0;

  const sorted = [...values].sort((a, b) => a - b);

  const index =
    Math.ceil((p / 100) * sorted.length) - 1;

  return sorted[Math.max(0, index)];
}

function connect(id) {
  return new Promise(resolve => {
    const start = performance.now();

    const ws = new WebSocket(
      `${CONFIG.url}/?token=${encodeURIComponent(CONFIG.token)}`
    );

    sockets.push(ws);

    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;

        connectionFailures++;

        try {
          ws.close();
        } catch {}

        resolve(false);
      }
    }, CONFIG.connectionTimeoutMs);

    ws.on('open', () => {
      console.log(`Connection ${id} opened`);
    });

    ws.on('message', data => {
      try {
        const message = JSON.parse(data.toString());

        /*
         * Initial connection event
         */
        if (message.type === 'connected') {
          if (!settled) {
            settled = true;

            clearTimeout(timeout);

            connected++;

            console.log(
              `Connection ${id} authenticated`
            );

            resolve(true);
          }

          return;
        }

        /*
         * Chat message received
         */
        if (message._id) {
          messagesReceived++;

          const sentAt =
            pendingMessages.get(message._id);

          if (sentAt) {
            const latency =
              performance.now() - sentAt;

            latencies.push(latency);

            pendingMessages.delete(message._id);
          }
        }

      } catch {
        // Ignore malformed messages
      }
    });

    ws.on('error', () => {
      if (!settled) {
        settled = true;

        clearTimeout(timeout);

        connectionFailures++;

        resolve(false);
      }
    });

    ws.on('close', () => {
      if (!settled) {
        settled = true;

        clearTimeout(timeout);

        connectionFailures++;

        resolve(false);
      }
    });
  });
}

async function sendMessages(ws, clientId) {
  for (
    let i = 0;
    i < CONFIG.messagesPerConnection;
    i++
  ) {
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      roomID: CONFIG.roomId,

      text: `Load test client ${clientId} message ${i}`,

      media: null,
    };

    /*
     * We cannot know the MongoDB _id before the
     * server saves the message, so latency here
     * is measured differently from request/response.
     */

    ws.send(JSON.stringify(message));

    messagesSent++;

    await sleep(CONFIG.messageIntervalMs);
  }
}

async function main() {
  console.log(`
==============================
WebSocket Load Test
==============================

Target:                 ${CONFIG.url}
Connections:            ${CONFIG.connections}
Messages / connection:  ${CONFIG.messagesPerConnection}
Message interval:       ${CONFIG.messageIntervalMs} ms
`);

  const testStart = performance.now();

  /*
   * Establish connections
   */
  console.log('Creating connections...\n');

  const connectionPromises = [];

  for (let i = 0; i < CONFIG.connections; i++) {
    connectionPromises.push(connect(i));

    /*
     * Small delay prevents the load generator itself
     * from creating one enormous connection burst.
     */
    await sleep(5);
  }

  await Promise.all(connectionPromises);

  console.log(`
Connections
-----------
Target:       ${CONFIG.connections}
Connected:    ${connected}
Failed:       ${connectionFailures}
`);

  /*
   * Send messages
   */
  console.log('Sending messages...\n');

  const senders = [];

  for (let i = 0; i < sockets.length; i++) {
    const ws = sockets[i];

    if (ws.readyState === WebSocket.OPEN) {
      senders.push(
        sendMessages(ws, i)
      );
    }
  }

  await Promise.all(senders);

  /*
   * Give server time to finish broadcasting.
   */
  await sleep(5_000);

  /*
   * Close connections
   */
  for (const ws of sockets) {
    try {
      ws.close();
    } catch {}
  }

  const duration =
    (performance.now() - testStart) / 1000;

  console.log(`
==============================
Results
==============================

Connections
-----------
Target:       ${CONFIG.connections}
Connected:    ${connected}
Failed:       ${connectionFailures}

Messages
--------
Sent:         ${messagesSent}
Received:     ${messagesReceived}

Duration
--------
${duration.toFixed(2)} seconds

Message throughput
------------------
${(messagesReceived / duration).toFixed(2)}
messages/sec

Expected broadcast messages
---------------------------
${messagesSent * connected}
`);

  if (latencies.length) {
    console.log(`
Latency
-------
Samples: ${latencies.length}
Average: ${
      (
        latencies.reduce((a, b) => a + b, 0) /
        latencies.length
      ).toFixed(2)
    } ms

P50: ${percentile(latencies, 50).toFixed(2)} ms
P95: ${percentile(latencies, 95).toFixed(2)} ms
P99: ${percentile(latencies, 99).toFixed(2)} ms
`);
  }

  console.log(`
==============================
Test Complete
==============================
`);
}

main();