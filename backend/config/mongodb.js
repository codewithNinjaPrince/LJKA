// import mongoose from "mongoose";

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 1) {
//     return;
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("MongoDB connected successfully");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     throw error;
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

const cache =
  globalThis.__ljkaMongooseCache ||
  (globalThis.__ljkaMongooseCache = {
    connection: null,
    promise: null,
  });

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    cache.connection = mongoose.connection;
    return cache.connection;
  }

  // A disconnected warm Vercel instance must start a fresh connection attempt.
  if (mongoose.connection.readyState === 0) {
    cache.connection = null;
    cache.promise = null;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        maxPoolSize: 5,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })
      .then(() => mongoose.connection)
      .catch((error) => {
        cache.connection = null;
        cache.promise = null;
        throw error;
      });
  }

  cache.connection = await cache.promise;
  return cache.connection;
};

export default connectDB;