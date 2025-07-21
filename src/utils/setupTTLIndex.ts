// Utility script to set up TTL index on expiresAt for burner-links collection
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { setupTTLIndex } from '@/utils/mongoUtils';
dotenv.config({ path: '../../.env' });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

async function setupTTL() {
  const client = new MongoClient(uri as string, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  const db = client.db();
  await db.collection('burner-links').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log('TTL index created on expiresAt');
  await client.close();
}

setupTTLIndex().catch(console.error);
