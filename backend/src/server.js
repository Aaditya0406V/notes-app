require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Check backend/.env');
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Check backend/.env');
    process.exit(1);
  }
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('Server running on http://localhost:' + PORT);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB. Is the MongoDB service running?');
    console.error(err.message);
    process.exit(1);
  }
};

start();
