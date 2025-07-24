import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Importato CORS
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// ✅ Attiva CORS per tutte le origini (puoi limitarlo se vuoi)
app.use(cors());

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new MongoClient(uri);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.get('/data', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db(dbName).collection(collectionName);
    const data = await collection.find({}).limit(100).toArray();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella connessione al database' });
  } finally {
    await client.close();
  }
});

// (opzionale) Route cortesia per /
app.get('/', (req, res) => {
  res.send('✅ API attiva. Endpoint: /data');
});

app.listen(port, () => {
  console.log(`✅ Server avviato su http://localhost:${port}`);
});

app.listen(port, () => {
  console.log(`✅ Server avviato su http://localhost:${port}`);
});
