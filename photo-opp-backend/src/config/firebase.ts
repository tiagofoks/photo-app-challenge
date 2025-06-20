import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = require("../../firebase-admin-key.json");

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

export { db, firebaseApp };
