import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../types/users';
import { RootState } from '../store';
import { IConnection } from '../types/users';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/users`,
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query<IUser[], void>({
            query: () => '',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'User' as const, id: _id })),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        getUsersByName: builder.mutation<IUser[], string>({
            query: (username) => ({
                url: `/username/${username}`,
                method: 'GET',
            }),
            invalidatesTags: ['User']
        }),
        getUser: builder.query<IUser, string>({
            query: (userId) => `/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
        }),
        getMutualFriends: builder.query<IConnection[], string>({
            query: (userId) => `/mutuals/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
        }),
        updateUser: builder.mutation<IUser, { userId: string; updates: Partial<IUser> }>({
            query: ({ userId, updates }) => ({
                url: `/${userId}`,
                method: 'PATCH',
                body: updates,
            }),
            invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (userId) => ({
                url: `/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, userId) => [
                { type: 'User', id: userId },
                { type: 'User', id: 'LIST' }
            ],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUsersByNameMutation,
    useGetUserQuery,
    useGetMutualFriendsQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApi;