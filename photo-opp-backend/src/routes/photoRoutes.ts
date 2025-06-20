
import { Router } from 'express';
import { uploadPhoto, getPhotos } from '../controllers/photoController'; 

const router = Router();

router.post('/upload', uploadPhoto);
router.get('/photos', getPhotos); 

export default router;