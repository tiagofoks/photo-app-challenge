import { Request, Response } from "express";
import { db } from "../config/firebase";
import { cloudinary } from "../config/cloudinary";
import admin from "firebase-admin";

export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res
        .status(400)
        .json({ message: "Dados da imagem não fornecidos." });
    }

    const uploadResult = await cloudinary.uploader.upload(imageData, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    const imageUrl = uploadResult.secure_url;

    await db.collection("photos").add({
      imageUrl,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      message: "Upload e registro bem-sucedidos!",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Erro no upload da imagem para Cloudinary:", error);
    res
      .status(500)
      .json({
        message: "Erro interno do servidor ao processar a imagem.",
        error: (error as Error).message,
      });
  }
};

export const getPhotos = async (req: Request, res: Response) => {
  try {
    const photosRef = db.collection("photos").orderBy("timestamp", "desc");
    const snapshot = await photosRef.get();

    const photos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ photos });
  } catch (error) {
    console.error("Erro ao buscar fotos do Firestore:", error);
    res
      .status(500)
      .json({
        message: "Erro interno do servidor ao buscar fotos.",
        error: (error as Error).message,
      });
  }
};
