import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/profile/ProfilePage.module.scss';

export enum ImageSize {
    SMALL,
    MEDIUM,
    LARGE
}

export interface ProfilePictureProps {
    userId: string;
    username: string;
    profilePicture: string;
    size: ImageSize;
    linkToProfile: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
    userId,
    username,
    profilePicture,
    size,
    linkToProfile
}) => {
    const getAvatarURI = (str: string) => {
        return `data:image/svg+xml;utf8,${encodeURIComponent(str)}`
    }

    const getImageSize = () => {
        switch (size) {
            case ImageSize.SMALL: return styles.small;
            case ImageSize.MEDIUM: return styles.medium;
            case ImageSize.LARGE: return styles.large;
        }
    }

    const pictureContent = (
        <div className={`${styles.profilePicture} ${getImageSize()}`}>
            <img
                src={getAvatarURI(profilePicture)}
                alt={username}
                className={styles.image}
            />
        </div>
    );

    return linkToProfile ?
        <Link to={`/profile/${userId}`}>{pictureContent}</Link> :
        pictureContent;
};

export default ProfilePicture;