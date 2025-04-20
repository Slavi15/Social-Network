import { useUploadImageMutation } from '../../redux/uploads/uploadApi';
import styles from '../../styles/components/posts/ImageUpload.module.scss';

interface ImageUploadProps {
    values: { content: string };
    setFieldValue: (field: string, value: any) => void;
    name: string;
}

const ImageUpload = ({ values, setFieldValue, name }: ImageUploadProps) => {
    const [uploadImage] = useUploadImageMutation();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await uploadImage(formData).unwrap();
            const imageMarkdown = `![${file.name}](${response.url})`;
            setFieldValue(name, `${values.content}\n${imageMarkdown}\n`);
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
                style={{ display: 'none' }}
            />
            
            <label htmlFor="file-upload" className={styles.customFileButton}>
                Select image
            </label>
        </div>
    );
};

export default ImageUpload;
