import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const uploadsApi = createApi({
    reducerPath: 'uploadsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}/upload`,
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
            query: (formData) => ({
                url: '/',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useUploadImageMutation,
} = uploadsApi;