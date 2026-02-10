import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
    throw new Error("Missing MONGODB_URI in .env.local");
}

if (!dbName) {
    throw new Error("Missing MONGODB_DB in .env.local");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getDb(): Promise<Db> {
    if (!client) {
        client = new MongoClient(uri!);
        clientPromise = client.connect();
    }

    return (await clientPromise!).db(dbName);
}
