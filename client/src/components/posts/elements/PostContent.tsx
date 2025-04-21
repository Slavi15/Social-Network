import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../../../styles/components/posts/Post.module.scss';

interface PostContentProps {
    content: string;
    media: {
        url: string;
        delete_url: string;
        filename: string;
    };
}

const PostContent: FC<PostContentProps> = ({ content, media }) => {
    return (
        <div className={styles.postContentContainer}>
            <div className={styles.postContent}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>

            {media && (
                <div className={styles.mediaContainer}>
                    <img
                        src={media.url}
                        alt={media.filename}
                        loading='lazy'
                        className={styles.postMedia} />
                </div>
            )}
        </div>
    );
};

export default PostContent;