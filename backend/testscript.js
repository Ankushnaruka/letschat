// const Room = require('./models/roomSchema');
// Room.findById("64f7b0e44e97be32972db234").then(console.log).catch(console.error);

const user = require('./models/userSchema');
user.findById("665f1a1a1a1a1a1a1a1a1a11").then(console.log).catch(console.error);

// const mongoose = require('mongoose');
// const Room = require('./models/roomSchema');
// require('dotenv').config();

// (async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   const room = await Room.findById("64f7b0e44e97be32972db234");
//   console.log("Room found:", room);
// })();

// const mongoose = require('mongoose');
// require('dotenv').config();

// (async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("Connected to:", mongoose.connection.name); // Shows DB name
// })();

// const mongoose = require('mongoose');
// const Room = require('./models/roomSchema'); // Adjust path if needed
// require('dotenv').config();

// (async () => {
//   await mongoose.connect(process.env.MONGO_URI);

//   const room = await Room.create({
//     _id: new mongoose.Types.ObjectId("64f7b0e44e97be32972db234"),
//     name: "Room Alpha",
//     admins: [new mongoose.Types.ObjectId("665f1a1a1a1a1a1a1a1a1a11")],
//     members: [
//       new mongoose.Types.ObjectId("665f1a1a1a1a1a1a1a1a1a11"),
//       new mongoose.Types.ObjectId("665f1a1a1a1a1a1a1a1a1a12")
//     ]
//   });

//   console.log("✅ Room inserted:", room);
//   process.exit();
// })();
