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
    }),
});

export const {
    useGetPostsQuery,
    useGetPostQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi;