import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormikContext } from 'formik';
import ImageUpload from './ImageUpload';
import { Privacy } from '../../redux/types/posts';
import styles from '../../styles/components/posts/MarkdownEditor.module.scss';

interface MediaProps {
    url: string;
    delete_url: string;
    filename: string;
}

interface MarkdownEditorProps {
    name: string;
    media: MediaProps | null;
}

const MarkdownEditor = ({ name, media }: MarkdownEditorProps) => {
    const { values, setFieldValue } = useFormikContext<{
        content: string;
        privacy: Privacy;
        media: MediaProps | null;
    }>();

    const [isPreview, setIsPreview] = useState(false);
    const [uploadedMedia, setUploadedMedia] = useState<MediaProps | null>(media);

    const handleUploadSuccess = (filename: string, url: string, delete_url: string) => {
        const mediaData = {
            url,
            delete_url,
            filename
        };
        setUploadedMedia(mediaData);
        setFieldValue('media', mediaData);
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorOptions}>
                <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className={styles.toggleButton}
                >
                    {isPreview ? 'Edit' : 'Preview'}
                </button>

                <ImageUpload
                    onUploadSuccess={handleUploadSuccess}
                />

                <select
                    name="privacy"
                    value={values.privacy}
                    onChange={(e) => setFieldValue('privacy', parseInt(e.target.value))}
                    className={styles.privacyOptions}
                >
                    <option value={Privacy.PUBLIC}>Public</option>
                    <option value={Privacy.FRIENDS}>Friends</option>
                    <option value={Privacy.PRIVATE}>Private</option>
                </select>
            </div>

            {uploadedMedia && (
                <div className={styles.uploadedFilename}>
                    {uploadedMedia.filename}
                </div>
            )}

            <div className={styles.editorContent}>
                {isPreview ? (
                    <div className={styles.editorPreview}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{values.content}</ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        name={name}
                        value={values.content}
                        onChange={(e) => setFieldValue(name, e.target.value)}
                        className={styles.mdEditor}
                    />
                )}
            </div>
        </div>
    );
};

export default MarkdownEditor;