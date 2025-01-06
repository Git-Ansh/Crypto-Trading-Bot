// server/__tests__/setup.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

// Optional: Log the ENCRYPTION_KEY for debugging (Remove after verification)
console.log('Test ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});
