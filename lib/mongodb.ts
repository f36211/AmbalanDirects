// lib/mongodb.ts
import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URL as string;

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

// Buat type yang benar untuk global
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse connection di mode dev (biar ga bikin banyak koneksi tiap reload)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Di production selalu bikin client baru
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
