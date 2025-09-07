// lib/mongodb.ts
import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Augment global so `global._mongoClientPromise` is typed.
declare global {
  // Using `var` in a `declare global` block is the recommended approach for
  // attaching properties to the Node.js global object in TypeScript.
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse connection in development to avoid exhausting connections on HMR.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  // TypeScript knows this is Promise<MongoClient> | undefined on the global, but
  // we just checked and initialized above, so non-null assertion is safe here.
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  // In production, create a new client for each lambda invocation.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
