import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IFriendRequest, UnfriendPayload } from "../types/friendRequests";
import { ProcessFriendRequestPayload, SendFriendRequestPayload } from "../types/friendRequests";
import { RootState } from "../store";

export const friendsApi = createApi({
    reducerPath: 'friendsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/friends`,
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['FriendRequest', 'User'],
    endpoints: (builder) => ({
        getPending: builder.query<IFriendRequest[], string>({
            query: (userId) => ({
                url: `/pending/${userId}`,
                method: 'GET',
            })
        }),
        sendRequest: builder.mutation<IFriendRequest, SendFriendRequestPayload>({
            query: (body) => ({
                url: '/send',
                method: 'POST',
                body
            }),
            invalidatesTags: ['FriendRequest'],
        }),
        cancelRequest: builder.mutation<void, SendFriendRequestPayload>({
            query: (body) => ({
                url: '/cancel',
                method: 'DELETE',
                body
            }),
            invalidatesTags: ['FriendRequest']
        }),
        checkRequestStatus: builder.query<IFriendRequest | null, { sender: string; receiver: string }>({
            query: ({ sender, receiver }) => ({
                url: '/status',
                method: 'GET',
                params: { sender, receiver }
            }),
            providesTags: ['FriendRequest']
        }),
        unfriend: builder.mutation<void, UnfriendPayload>({
            query: (body) => ({
                url: '/unfriend',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User']
        }),
        acceptRequest: builder.mutation<void, ProcessFriendRequestPayload>({
            query: ({ requestId }) => ({
                url: `/accept/${requestId}`,
                method: 'PUT'
            }),
            invalidatesTags: ['FriendRequest']
        }),
        rejectRequest: builder.mutation<void, ProcessFriendRequestPayload>({
            query: ({ requestId }) => ({
                url: `/reject/${requestId}`,
                method: 'PUT'
            }),
            invalidatesTags: ['FriendRequest']
        }),
    })
});

export const {
    useGetPendingQuery,
    useSendRequestMutation,
    useCancelRequestMutation,
    useCheckRequestStatusQuery,
    useUnfriendMutation,
    useAcceptRequestMutation,
    useRejectRequestMutation
} = friendsApi;