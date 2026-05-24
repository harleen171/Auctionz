/**
 * Express session with MongoDB (connect-mongo).
 * Use createSessionMiddleware(mongoUrl) after connectDB() so the URL matches Mongoose.
 */

const session = require('express-session');
const MongoStore = require('connect-mongo');

function createSessionMiddleware(mongoUrl) {
  const url =
    mongoUrl ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/auctionz';

  return session({
    store: new MongoStore({
      mongoUrl: url,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
    },
    name: 'sessionId',
  });
}

module.exports = { createSessionMiddleware };
