import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IEvent } from "../types/events";
import { RootState } from "../store";

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
    tagTypes: ['Event'],
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
                method: 'POST',
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
    useLeaveEventMutation
} = eventsApi;