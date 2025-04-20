import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { IUser } from '../types/index';
import type { LoginRequest, RegisterRequest } from '../types/auth';
import type { RootState } from '../store';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/auth`,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation<{ user: IUser; accessToken: string }, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<{ user: IUser; accessToken: string }, RegisterRequest>({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: '/logout',
                method: 'POST'
            }),
        }),
        refreshToken: builder.mutation<{ user: IUser; accessToken: string }, void>({
            query: () => ({
                url: '/refresh',
                method: 'POST',
                credentials: 'include',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation
} = api;
