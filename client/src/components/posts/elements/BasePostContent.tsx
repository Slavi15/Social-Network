import { FC } from 'react';
import { MediaProps } from '../../../redux/types/posts';
import styles from '../../../styles/components/posts/Post.module.scss';

interface BasePostContentProps {
    content: string;
    media?: MediaProps | null;
}

const BasePostContent: FC<BasePostContentProps> = ({ 
    content, 
    media 
}) => {
    return (
        <div className={styles.postContent}>
            {content && <p className={styles.postText}>{content}</p>}
            {media && (
                <div className={styles.mediaContainer}>
                    <img src={media.url} alt="Post media" className={styles.media} />
                </div>
            )}
        </div>
    );
};

export default BasePostContent;