// server/index.js
const dotenv = require('dotenv');

// Load environment variables from .env or .env.test based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validateEnv = require('./utils/validateEnv');
validateEnv(); // Validate environment variables before proceeding

// Access environment variables
const {
  NODE_ENV,
  PORT = 5000,
  JWT_SECRET,
  ENCRYPTION_KEY,
  MONGO_URI,
} = process.env;

// Ensure essential environment variables are set
if (!JWT_SECRET || !ENCRYPTION_KEY || !MONGO_URI) {
  console.error('Missing essential environment variables. Exiting...');
  process.exit(1);
}
//console.log(NODE_ENV);
const app = express();
//const PORT = process.env.PORT || 5000;


var address = 'https://crypto-pilot.onrender.com';

if (NODE_ENV === 'test') {
  address = 'http://localhost:5173';
}
console.log('address', address);
// Middleware
app.use(cors({
  origin: address, // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // Adds security-related HTTP headers

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(
  helmet.hsts({
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Import Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const tradesRoutes = require('./routes/trades');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trades', tradesRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the Crypto Trading Bot API');
});

// Error Handling Middleware (Must be after all other routes)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
