const mongoose = require('mongoose');

let resolvedMongoUri = null;

function getResolvedMongoUri() {
  return (
    resolvedMongoUri ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/auctionz'
  );
}

function redactMongoUri(uri) {
  if (!uri) return '';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
}

function isAtlasUri(uri) {
  return typeof uri === 'string' && uri.trim().toLowerCase().startsWith('mongodb+srv://');
}

function buildConnectionCandidates() {
  const out = [];
  const push = (u) => {
    if (u && !out.includes(u)) out.push(u);
  };
  if (process.env.MONGO_URI) push(process.env.MONGO_URI.trim());

  // Only use local fallback when no Atlas URI is provided.
  if (!process.env.MONGO_URI) {
    push('mongodb://127.0.0.1:27017/auctionz');
    push('mongodb://localhost:27017/auctionz');
  }
  return out;
}

function mongooseOptions(uri) {
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 20000,
  };

  if (isAtlasUri(uri)) {
    // Atlas requires TLS and DNS SRV support.
    opts.tls = true;
    opts.retryWrites = true;
    opts.w = 'majority';
  }

  if (process.env.MONGO_IPV4_ONLY === '1' || process.env.MONGO_IPV4_ONLY === 'true') {
    opts.family = 4;
  }
  return opts;
}

function printConnectionHelp() {
  console.error('\nAtlas: Network Access → add your IP. Database user must match MONGO_URI.');
  console.error('Local: run mongod, or set MONGO_URI in .env');
  console.error('Optional: MONGO_IPV4_ONLY=1 on Windows if Atlas times out.\n');
}

async function connectDB() {
  const candidates = buildConnectionCandidates();
  console.log('Connecting to MongoDB...');
  const opts = mongooseOptions();
  let lastError = null;

  for (let i = 0; i < candidates.length; i += 1) {
    const uri = candidates[i];
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (e) {
      /* ignore */
    }
    try {
      console.log(`  [${i + 1}/${candidates.length}] ${redactMongoUri(uri)}`);
      const conn = await mongoose.connect(uri, mongooseOptions(uri));
      resolvedMongoUri = uri;
      console.log(`MongoDB connected: ${conn.connection.host} — "${conn.connection.name}"`);
      return conn;
    } catch (err) {
      lastError = err;
      console.warn(`    ${err.message}`);
    }
  }

  console.error('Could not connect to MongoDB.');
  if (lastError) console.error('Last error:', lastError.message);
  printConnectionHelp();
  process.exit(1);
}

async function disconnectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      return;
    }
    await mongoose.disconnect();
    resolvedMongoUri = null;
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
  getResolvedMongoUri,
};
