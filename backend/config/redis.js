const { createClient } = require('redis');

const resolveRedisUrl = () => {
  const raw = process.env.REDIS_URL && process.env.REDIS_URL.trim();
  if (!raw) return 'redis://127.0.0.1:6379';

  try {
    const url = new URL(raw);
    if (url.hostname && url.hostname !== 'localhost') {
      return raw;
    }
  } catch {
    // ignore malformed URLs and fall back to local redis
  }

  return 'redis://127.0.0.1:6379';
};

const redisUrl = resolveRedisUrl();
const publisher = createClient({ url: redisUrl });
const subscriber = createClient({ url: redisUrl });

publisher.on('error', (err) => console.error('Redis publisher error:', err.message));
subscriber.on('error', (err) => console.error('Redis subscriber error:', err.message));

publisher.on('ready', () => console.log('Redis publisher ready'));
subscriber.on('ready', () => console.log('Redis subscriber ready'));

async function connectClient(client, role) {
  try {
    await client.connect();
  } catch (err) {
    console.warn(`Redis ${role} unavailable; local fallback will be used:`, err.message);
  }
}

// Connect independently so one failed role does not prevent the other from starting.
Promise.all([connectClient(publisher, 'publisher'), connectClient(subscriber, 'subscriber')]);

module.exports = { publisher, subscriber };
