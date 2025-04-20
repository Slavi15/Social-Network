import { NextFunction, Request, Response } from "express";
import { UploadedFile } from 'express-fileupload';
import imgbbUploader from 'imgbb-uploader';
import { AppError, HttpCode } from "@/exceptions/AppError";

interface UploadRequest extends Request {
    files: {
        image: UploadedFile | UploadedFile[];
    };
}

interface ImgBBResponse {
    id: string;
    title: string;
    url: string;
    delete_url: string;
}

class UploadController {

    public uploadImage = async (req: UploadRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.files || !req.files.image) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "No image file provided"
                });
            }

            const imageFile = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;

            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedMimeTypes.includes(imageFile.mimetype)) {
                throw new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: "Invalid file type. Only images are allowed"
                });
            }

            const base64Image = imageFile.data.toString('base64');

            const response: ImgBBResponse = await imgbbUploader({
                apiKey: process.env.IMGBB_API_KEY || '',
                base64string: base64Image,
                name: imageFile.name.replace(/\.[^/.]+$/, ""),
                expiration: 0
            });

            res.status(HttpCode.OK)
                .json({
                    id: response.id,
                    title: response.title,
                    url: response.url,
                    delete_url: response.delete_url,
                });
        } catch (err) {
            next(new AppError({
                httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                description: "Failed to upload image",
            }));
        }
    }
}

export const uploadController = new UploadController();