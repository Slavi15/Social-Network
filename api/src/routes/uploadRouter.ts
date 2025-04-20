import { Router } from 'express';
import { uploadController } from '@/controllers/uploadController';

const uploadRouter = Router();

uploadRouter.post('/', uploadController.uploadImage);

export default uploadRouter;