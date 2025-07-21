const { MongoClient, ServerApiVersion } = require('mongodb');
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
const uri = process.env.MONGODB_URI;

export async function getDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db(process.env.MONGODB_DB_NAME);
}

export async function setupTTLIndex() {
    const db = await getDB();
    await db.collection(process.env.MONGODB_COLLECTION_NAME).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    console.log('TTL index created on expiresAt');
}

export async function testConnection() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}

export async function getCollection(collectionName: string) {
    const db = await getDB();
    return db.collection(collectionName);
}