import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Importa CORS

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Abilita CORS per tutte le origini (oppure limita a Vercel)
app.use(cors()); 
// oppure per maggiore sicurezza:
// app.use(cors({ origin: 'https://certs-front-end.vercel.app' }));

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

const client = new MongoClient(uri);

app.get('/data', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const data = await collection.find({}).limit(100).toArray();
    res.json(data);
  } catch (err) {
    console.error('Errore DB:', err);
    res.status(500).json({ error: 'Errore nella connessione al database' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`✅ Server avviato su http://localhost:${port}`);
});
