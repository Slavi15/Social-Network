import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IChat, IMessage } from "../types/chats";
import { RootState } from "../store";
import { getSocket } from "../../lib/socket";
import { SocketEvent } from "../types/sockets";

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (<RootState>getState()).auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Chat', 'Message'],
    endpoints: (builder) => ({
        getChats: builder.query<IChat[], string>({
            query: (userId) => `/chats/users/${userId}`,
            providesTags: ['Chat'],
            async onCacheEntryAdded(
                _arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const socket = getSocket();
                try {
                    await cacheDataLoaded;
                    socket.on(SocketEvent.NEW_MESSAGE, (conversation: {
                        chatId: string;
                        message: IMessage;
                    }) => {
                        const { chatId, message } = conversation;

                        updateCachedData((draft) => {
                            const chatIndex = draft.findIndex(chat => chat._id === chatId);

                            if (chatIndex !== -1) {
                                const updatedChat = {
                                    ...draft[chatIndex],
                                    lastMessage: message,
                                    updatedAt: new Date(),
                                };

                                draft.splice(chatIndex, 1);
                                draft.unshift(updatedChat);
                            }
                        })
                    })
                } catch (err) {
                    console.error(err);
                }
                await cacheEntryRemoved;
                socket.close();
            }
        }),
        getChat: builder.query<IChat, { chatId: string; userId: string }>({
            query: ({ chatId, userId }) => `/chats/${chatId}/users/${userId}`,
            providesTags: (result) => [{ type: 'Chat', id: result?._id }],
        }),
        getMessages: builder.query<IMessage[], { chatId: string; userId: string }>({
            query: ({ chatId, userId }) => `/chats/${chatId}/users/${userId}/messages`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Message' as const, id: _id })),
                        { type: 'Message', id: 'LIST' },
                    ]
                    : [{ type: 'Message', id: 'LIST' }],
        }),
        createChat: builder.mutation<{ chatId: string }, { userId: string; participantId: string }>({
            query: ({ userId, participantId }) => ({
                url: `/chats/create/${participantId}/users/${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Chat'],
        }),
        sendMessage: builder.mutation<
            IMessage,
            { chatId: string; userId: string; content: string }
        >({
            queryFn: async ({ chatId, userId, content }) => {
                const socket = getSocket();
                const tempId = Date.now().toString();

                return new Promise((resolve) => {
                    socket.emit(
                        SocketEvent.SEND_MESSAGE,
                        { chatId, senderId: userId, content, tempId },
                        (response: { message: IMessage }) => {
                            resolve({ data: response.message });
                        }
                    );
                });
            },
            invalidatesTags: (_result, _error, { chatId }) => [
                { type: 'Chat', id: chatId },
                { type: 'Message', id: 'LIST' },
            ],
        }),
    })
})

export const {
    useGetChatsQuery,
    useGetChatQuery,
    useGetMessagesQuery,
    useCreateChatMutation,
    useSendMessageMutation,
} = chatsApi;