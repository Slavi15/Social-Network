import { useUploadImageMutation } from '../../redux/uploads/uploadApi';
import styles from '../../styles/components/posts/ImageUpload.module.scss';

interface ImageUploadProps {
    onUploadSuccess: (filename: string, url: string, deleteUrl: string) => void;
}

const ImageUpload = ({ onUploadSuccess }: ImageUploadProps) => {
    const [uploadImage] = useUploadImageMutation();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await uploadImage(formData).unwrap();
            onUploadSuccess(file.name, response.url, response.delete_url);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className={styles.fileUploadContainer}>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="file-upload"
                className={styles.imageInput}
            />

            <label htmlFor="file-upload" className={styles.customFileButton}>
                Select image
            </label>
        </div>
    );
};

export default ImageUpload;
