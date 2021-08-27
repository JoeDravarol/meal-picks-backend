require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const FIREBASE_CREDS = process.env.FIREBASE_CREDS;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;

module.exports = { PORT, MONGODB_URI, FIREBASE_CREDS, FIREBASE_PRIVATE_KEY };
