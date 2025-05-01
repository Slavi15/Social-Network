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
    tagTypes: ['FriendRequest', 'User', 'Auth', 'FriendStatus'],
    endpoints: (builder) => ({
        getRequests: builder.query<IFriendRequest[], void>({
            query: () => '/pending',
            providesTags: ['FriendRequest'],
        }),
        getPending: builder.query<IFriendRequest[], string>({
            query: (userId) => `/pending/${userId}`,
            providesTags: ['FriendRequest'],
        }),
        sendRequest: builder.mutation<IFriendRequest, SendFriendRequestPayload>({
            query: (body) => ({
                url: '/send',
                method: 'POST',
                body
            }),
            invalidatesTags: (_result, _error, { sender, receiver }) => [
                'FriendRequest',
                'Auth',
                { type: 'FriendStatus', id: `${sender}-${receiver}` }
            ]
        }),
        cancelRequest: builder.mutation<void, SendFriendRequestPayload>({
            query: (body) => ({
                url: '/cancel',
                method: 'DELETE',
                body
            }),
            invalidatesTags: (_result, _error, { sender, receiver }) => [
                'FriendRequest', 
                'Auth',
                { type: 'FriendStatus', id: `${sender}-${receiver}` }
            ]
        }),
        checkRequestStatus: builder.query<IFriendRequest | null, { sender: string; receiver: string }>({
            query: ({ sender, receiver }) => ({
                url: '/status',
                method: 'GET',
                params: { sender, receiver }
            }),
            providesTags: (result, _error, { sender, receiver }) =>
                result
                    ? [{ type: 'FriendStatus', id: `${sender}-${receiver}` }]
                    : ['FriendStatus']
        }),
        unfriend: builder.mutation<void, UnfriendPayload>({
            query: (body) => ({
                url: '/unfriend',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User', 'Auth', 'FriendStatus']
        }),
        acceptRequest: builder.mutation<void, ProcessFriendRequestPayload>({
            query: ({ requestId }) => ({
                url: `/accept/${requestId}`,
                method: 'PUT'
            }),
            invalidatesTags: ['FriendRequest', 'Auth', 'FriendStatus']
        }),
        rejectRequest: builder.mutation<void, ProcessFriendRequestPayload>({
            query: ({ requestId }) => ({
                url: `/reject/${requestId}`,
                method: 'PUT'
            }),
            invalidatesTags: ['FriendRequest', 'Auth', 'FriendStatus']
        }),
    })
});

export const {
    useGetRequestsQuery,
    useGetPendingQuery,
    useSendRequestMutation,
    useCancelRequestMutation,
    useCheckRequestStatusQuery,
    useUnfriendMutation,
    useAcceptRequestMutation,
    useRejectRequestMutation
} = friendsApi;