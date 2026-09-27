const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const { publisher } = require('./config/redis');

const INTERVAL_MS = 4 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10 * 1000;
const keepAliveUrl = resolveKeepAliveUrl(process.env.BASE_URL);

let isRunning = false;
let timer = null;
let activeRequest = null;

function resolveKeepAliveUrl(baseUrl) {
  if (!baseUrl || !baseUrl.trim()) return null;

  try {
    return new URL('/ping', baseUrl.trim()).toString();
  } catch {
    console.warn('[keepalive] BASE_URL is not a valid URL; application pings are disabled');
    return null;
  }
}

async function pingApplication() {
  if (!keepAliveUrl) return;

  const controller = new AbortController();
  activeRequest = controller;
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(keepAliveUrl, { signal: controller.signal });
    await response.text();
    if (!response.ok) {
      console.warn(`[keepalive] Application ping returned HTTP ${response.status}`);
      return;
    }
    console.info('[keepalive] Application ping succeeded');
  } catch (err) {
    const reason = controller.signal.aborted ? 'request timed out' : err.message;
    console.warn('[keepalive] Application ping failed:', reason);
  } finally {
    clearTimeout(timeout);
    if (activeRequest === controller) activeRequest = null;
  }
}

async function pingMongoDB() {
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    console.warn('[keepalive] MongoDB is not connected; ping skipped');
    return;
  }

  try {
    await mongoose.connection.db.admin().ping();
    console.info('[keepalive] MongoDB ping succeeded');
  } catch (err) {
    console.warn('[keepalive] MongoDB ping failed:', err.message);
  }
}

async function pingRedis() {
  if (!publisher?.isReady) {
    console.warn('[keepalive] Redis publisher is not ready; ping skipped');
    return;
  }

  try {
    await publisher.ping();
    console.info('[keepalive] Redis ping succeeded');
  } catch (err) {
    console.warn('[keepalive] Redis ping failed:', err.message);
  }
}

async function runKeepAlive() {
  if (!isRunning) return;

  await Promise.all([pingApplication(), pingMongoDB(), pingRedis()]);

  // Schedule after the current cycle completes so slow services cannot cause
  // overlapping keepalive runs.
  if (isRunning) timer = setTimeout(runKeepAlive, INTERVAL_MS);
}

function StartKeepAlivePing() {
  if (isRunning) {
    console.info('[keepalive] Job is already running');
    return stopKeepAlivePing;
  }

  isRunning = true;
  if (!keepAliveUrl) {
    console.info('[keepalive] Application self-ping is disabled');
  }
  console.info('[keepalive] Job started; running every 4 minutes');
  void runKeepAlive();

  return stopKeepAlivePing;
}

function stopKeepAlivePing() {
  isRunning = false;
  if (timer) clearTimeout(timer);
  timer = null;
  activeRequest?.abort();
  activeRequest = null;
  console.info('[keepalive] Job stopped');
}

module.exports = StartKeepAlivePing;
