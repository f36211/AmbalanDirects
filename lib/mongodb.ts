// lib/mongodb.ts
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local or set MONGO_URL in the environment");
}

// Reinstated standard options for better compatibility and error handling with Atlas.
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Augment global so `global._mongoClientPromise` is typed for development.
declare global {
  // Using `var` in a `declare global` block is the recommended approach.
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch(err => {
        console.error("Initial MongoDB connection error:", err);
        throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

