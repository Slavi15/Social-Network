import { IPost, Privacy } from "@/models/posts";

export const validatePost = (data: Partial<IPost>, isUpdate = false): string | null => {
    const { user_id, content, media_url, privacy } = data;

    if (!isUpdate) {
        if (!user_id) {
            return "User ID is required!";
        };

        if (!content || content.trim().length === 0) {
            return "Content is required!";
        };
    };

    if (content && content.trim().length > 200) {
        return "Post content should not exceed 200 symbols!";
    };

    if (privacy !== undefined && !Object.values(Privacy).includes(privacy)) {
        return "Invalid privacy!";
    }
    
    return null;
}