
import mongoose from 'mongoose';

// Small ambient declaration so we can attach a cache to global in a Node
// environment without TypeScript errors in server contexts.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/innotech';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  // give cached a consistent shape
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB with URI:", MONGODB_URI);
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
    } catch (e) {
      console.error("MongoDB connection error:", e);
      throw e;
    }
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
