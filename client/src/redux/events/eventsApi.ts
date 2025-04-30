import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IEvent } from "../types/events";
import { RootState } from "../store";
import { IComment, IPost, MediaProps } from "../types/posts";
import { IUser } from "../types/users";

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/events`,
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Event', 'EventPost'],
    endpoints: (builder) => ({
        getEvents: builder.query<IEvent[], void>({
            query: () => '',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Event' as const, id: _id })), 'Event']
                    : ['Event'],
        }),
        getEventById: builder.query<IEvent, string>({
            query: (eventId) => `/${eventId}`,
            providesTags: (_result, _error, id) => [{ type: 'Event', id }],
        }),
        getEventByTitle: builder.query<IEvent[], string>({
            query: (title) => `/title/${title}`,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Event' as const, id: _id })), 'Event']
                    : ['Event'],
        }),
        createEvent: builder.mutation({
            query: (eventData) => ({
                url: '/create',
                method: 'POST',
                body: eventData,
            }),
            invalidatesTags: ['Event'],
        }),
        updateEvent: builder.mutation({
            query: ({ eventId, updates }) => ({
                url: `/${eventId}/update`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['Event'],
        }),
        deleteEvent: builder.mutation<void, string>({
            query: (eventId) => ({
                url: `/${eventId}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Event', id }],
        }),
        addCreator: builder.mutation<IEvent, { eventId: string; creatorId: string }>({
            query: ({ eventId, creatorId }) => ({
                url: `/${eventId}/add`,
                method: 'PUT',
                body: { creatorId },
            }),
            invalidatesTags: ['Event'],
        }),
        removeCreator: builder.mutation<IEvent, { eventId: string; creatorId: string }>({
            query: ({ eventId, creatorId }) => ({
                url: `/${eventId}/remove`,
                method: 'PUT',
                body: { creatorId },
            }),
            invalidatesTags: ['Event'],
        }),
        joinEvent: builder.mutation<IEvent, { eventId: string; userId: string }>({
            query: ({ eventId, userId }) => ({
                url: `/${eventId}/join`,
                method: 'PUT',
                body: { userId },
            }),
            invalidatesTags: ['Event'],
        }),
        leaveEvent: builder.mutation<IEvent, { eventId: string; userId: string }>({
            query: ({ eventId, userId }) => ({
                url: `/${eventId}/leave`,
                method: 'PUT',
                body: { userId },
            }),
            invalidatesTags: ['Event'],
        }),
        getEventPosts: builder.query<IPost[], string>({
            query: (eventId) => `/${eventId}/posts`,
            providesTags: (result, _error, eventId) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'EventPost' as const, id: _id })),
                        { type: 'Event', id: eventId }
                    ]
                    : [{ type: 'Event', id: eventId }],
        }),
        createEventPost: builder.mutation<IPost, {
            eventId: string;
            postData: {
                user_id: IUser | null;
                content: string;
                media: MediaProps | null;
            };
        }>({
            query: ({ eventId, postData }) => ({
                url: `/${eventId}/posts/create`,
                method: 'POST',
                body: postData,
            }),
            invalidatesTags: (_result, _error, { eventId }) => [
                { type: 'Event', id: eventId },
                'EventPost'
            ],
        }),
        updateEventPost: builder.mutation<IPost, { eventId: string; postId: string; updates: Partial<IPost> }>({
            query: ({ eventId, postId, updates }) => ({
                url: `/${eventId}/posts/${postId}/update`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (_result, _error, { postId }) => [
                { type: 'EventPost', id: postId }
            ],
        }),
        deleteEventPost: builder.mutation<void, { eventId: string; postId: string; userId: string }>({
            query: ({ eventId, postId, userId }) => ({
                url: `/${eventId}/posts/${postId}/delete`,
                method: 'DELETE',
                body: { userId }
            }),
            invalidatesTags: (_result, _error, { postId, eventId }) => [
                { type: 'EventPost', id: postId },
                { type: 'Event', id: eventId }
            ],
        }),
        likeEventPost: builder.mutation<IPost, { eventId: string; postId: string; userId: string }>({
            query: ({ eventId, postId, userId }) => ({
                url: `/${eventId}/posts/${postId}/like`,
                method: 'POST',
                body: { userId },
            }),
            invalidatesTags: (_result, _error, { postId }) => [
                { type: 'EventPost', id: postId }
            ],
        }),
        addCommentToEventPost: builder.mutation<IComment, { eventId: string; postId: string; commentData: Omit<IComment, '_id' | 'createdAt' | 'updatedAt'> }>({
            query: ({ eventId, postId, commentData }) => ({
                url: `/${eventId}/posts/${postId}/comments`,
                method: 'POST',
                body: commentData,
            }),
            invalidatesTags: (_result, _error, { postId }) => [
                { type: 'EventPost', id: postId }
            ],
        }),
        editCommentEventPost: builder.mutation<IComment, { eventId: string; postId: string; commentId: string; userId: string; content: string; }>({
            query: ({ eventId, postId, commentId, userId, content }) => ({
                url: `/${eventId}/posts/${postId}/comments/${commentId}/edit`,
                method: 'PUT',
                body: { userId, content }
            }),
            invalidatesTags: (_result, _error, { postId }) => [
                { type: 'EventPost', id: postId }
            ],
        }),
        deleteCommentEventPost: builder.mutation<IComment, { eventId: string; postId: string; commentId: string; userId: string; }>({
            query: ({ eventId, postId, commentId, userId }) => ({
                url: `/${eventId}/posts/${postId}/comments/${commentId}/delete`,
                method: 'DELETE',
                body: { userId }
            }),
            invalidatesTags: (_result, _error, { postId }) => [
                { type: 'EventPost', id: postId }
            ],
        }),
    })
});

export const {
    useGetEventsQuery,
    useGetEventByIdQuery,
    useGetEventByTitleQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useAddCreatorMutation,
    useRemoveCreatorMutation,
    useJoinEventMutation,
    useLeaveEventMutation,
    useGetEventPostsQuery,
    useCreateEventPostMutation,
    useUpdateEventPostMutation,
    useDeleteEventPostMutation,
    useLikeEventPostMutation,
    useAddCommentToEventPostMutation,
    useEditCommentEventPostMutation,
    useDeleteCommentEventPostMutation
} = eventsApi;