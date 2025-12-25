import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MongoDB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { dbName: "devFlow" })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;

/* Exmaple of cached.conn object 
  {
   -- The primary connection details --
  connection: {
    host: "your-cluster.mongodb.net",
    port: 27017,
    name: "devFlow",
    readyState: 1, // 1 means 'connected'
    models: { ... }, // All models registered in your app
    db: Admin { ... }, // The raw MongoDB Driver instance
  },
  
  -- Mongoose utilities (methods you usually import from 'mongoose') --
  models: { ... },
  Schema: [Function: Schema],
  model: [Function: model],
  Types: { ObjectId: [Function], ... },
  
  -- State management -- 
  connections: [ [Connector] ], // Array of all open connections
  plugins: []
}
*/
