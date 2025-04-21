import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../../../styles/components/posts/Post.module.scss';

interface PostContentProps {
    content: string;
}

const PostContent: FC<PostContentProps> = ({ content }) => {
    return (
        <div className={styles.postContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default PostContent;