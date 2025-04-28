import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import { api } from './auth/authApi';
import { postsApi } from './posts/postsApi';
import { uploadsApi } from './uploads/uploadApi';
import { usersApi } from './users/usersApi';
import { friendsApi } from './friends/friendsApi';
import { chatsApi } from './chats/chatsApi';
import { eventsApi } from './events/eventsApi';

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['accessToken', 'user'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [uploadsApi.reducerPath]: uploadsApi.reducer,
        [friendsApi.reducerPath]: friendsApi.reducer,
        [chatsApi.reducerPath]: chatsApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        auth: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
        .concat(api.middleware)
        .concat(postsApi.middleware)
        .concat(usersApi.middleware)
        .concat(uploadsApi.middleware)
        .concat(friendsApi.middleware)
        .concat(chatsApi.middleware)
        .concat(eventsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
