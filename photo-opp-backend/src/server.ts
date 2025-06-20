import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import admin from 'firebase-admin'; 
import { v2 as cloudinary } from 'cloudinary'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
  
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore(); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true 
});


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));


app.get('/', (req, res) => {
  res.status(200).send('Photo Opp Backend is running and ready for Cloudinary uploads!');
});


app.post('/api/upload', async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: 'Dados da imagem não fornecidos.' });
    }

    
    
    

    
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: 'photo-opp', 
      resource_type: 'image',
      quality: "auto:low", 
      format: "auto", 
      transformation: [ 
        { width: 540, height: 960, crop: "limit" } 
      ]
    });

    const imageUrl = uploadResult.secure_url; 

    
    await db.collection('photos').add({
      imageUrl: imageUrl,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Upload e registro bem-sucedidos!', imageUrl: imageUrl });

  } catch (error) {
    console.error('Erro no upload da imagem para Cloudinary:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao processar a imagem.', error: (error as Error).message });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Backend is running on http://localhost:${PORT}`);
  console.log(`CORS configured for origin: http://localhost:3000`);
});