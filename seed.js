require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Thought = require('./models/Thought');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/social-network-api';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, options);

mongoose.connection.on('connected', async () => {
  console.log(`Mongoose connected to ${MONGODB_URI}`);

  try {
    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Create users
    const users = [
      { username: 'user1', email: 'user1@example.com' },
      { username: 'user2', email: 'user2@example.com' },
      { username: 'user3', email: 'user3@example.com' },
    ];
    const createdUsers = await User.insertMany(users);

    // Create thoughts
    const thoughts = [
      { thoughtText: 'This is a thought by user1', username: createdUsers[0].username },
      { thoughtText: 'This is a thought by user2', username: createdUsers[1].username },
      { thoughtText: 'This is a thought by user3', username: createdUsers[2].username },
    ];
    const createdThoughts = await Thought.insertMany(thoughts);

    // Link thoughts to users
    for (let i = 0; i < createdUsers.length; i++) {
      createdUsers[i].thoughts.push(createdThoughts[i]._id);
      await createdUsers[i].save();
    }

    console.log('Dummy data inserted successfully!');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  } finally {
    mongoose.connection.close();
  }
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
