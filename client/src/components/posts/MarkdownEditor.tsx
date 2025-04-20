import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useFormikContext } from 'formik';
import { Privacy } from './PostForm';
import styles from '../../styles/components/posts/MarkdownEditor.module.scss';
import ImageUpload from './ImageUpload';

interface MarkdownEditorProps {
    name: string;
}

const MarkdownEditor = ({ name }: MarkdownEditorProps) => {
    const { values, setFieldValue } = useFormikContext<{
        content: string;
        privacy: Privacy;
    }>();

    const [isPreview, setIsPreview] = useState(false);

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
                    values={values}
                    setFieldValue={setFieldValue}
                    name={name}
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
}

export default MarkdownEditor;
