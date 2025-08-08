const mongoose = require('mongoose');
require('dotenv').config();

async function pingDB() {
  try {
    // A simple MongoDB command to keep it awake
    await mongoose.connection.db.admin().ping();
    console.log('✅ MongoDB ping successful');
  } catch (err) {
    console.error('❌ MongoDB ping failed:', err.message);
  }
}

function StartKeepAlivePing() {
  setInterval(async () => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/ping`);
      console.log('🌐 Keep-alive ping sent:', res.status);
      await pingDB();
    } catch (err) {
      console.error('❌ Keep-alive ping failed:', err.message);
    }
  }, 1000 * 60 * 4); // every 4 minutes
}

module.exports = StartKeepAlivePing;
