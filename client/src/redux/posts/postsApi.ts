import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/posts`,
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: () => '',
            providesTags: ['Posts'],
        }),
        getUserPosts: builder.query({
            query: (userId) => ({
                url: `/${userId}`,
                method: 'GET'
            }),
            providesTags: ['Posts'],
        }),
        getVisiblePosts: builder.query({
            query: (userId) => ({
                url: `/visible/${userId}`,
                method: 'GET'
            }),
            providesTags: ['Posts'],
        }),
        getPost: builder.query({
            query: (postId) => `/${postId}`,
            providesTags: (_result, _error, arg) => [{ type: 'Posts', id: arg }],
        }),
        createPost: builder.mutation({
            query: (postData) => ({
                url: '',
                method: 'POST',
                body: postData,
            }),
            invalidatesTags: ['Posts'],
        }),
        updatePost: builder.mutation({
            query: ({ postId, ...patch }) => ({
                url: `/${postId}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Posts', id: arg.postId }],
        }),
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Posts', id: arg }],
        }),
        likePost: builder.mutation({
            query: ({ postId, userId }) => ({
                url: `/${postId}/like`,
                method: 'PUT',
                body: { userId }
            }),
            invalidatesTags: ['Posts'],
        }),
        addComment: builder.mutation({
            query: ({ postId, userId, content }) => ({
                url: `/${postId}/comments`,
                method: 'POST',
                body: { userId, content }
            }),
            invalidatesTags: ['Posts'],
        }),
        editComment: builder.mutation({
            query: ({ postId, commentId, content }) => ({
                url: `/${postId}/comments/${commentId}`,
                method: 'PUT',
                body: { content }
            }),
            invalidatesTags: ['Posts'],
        }),
        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `/${postId}/comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts'],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useGetUserPostsQuery,
    useGetVisiblePostsQuery,
    useGetPostQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useAddCommentMutation,
    useEditCommentMutation,
    useDeleteCommentMutation
} = postsApi;
