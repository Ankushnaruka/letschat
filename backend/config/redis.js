const { createClient } = require('redis');

// Use explicit default if REDIS_URL is empty or not set
const redisUrl = process.env.REDIS_URL && process.env.REDIS_URL.trim() !== ''
	? process.env.REDIS_URL
	: 'redis://127.0.0.1:6379';

const publisher = createClient({ url: redisUrl });
const subscriber = createClient({ url: redisUrl });

publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));

(async () => {
	try {
		await publisher.connect();
		await subscriber.connect();
		console.log('Redis connected');
	} catch (err) {
		console.error('Failed to connect to Redis:', err);
	}
})();

module.exports = { publisher, subscriber };
