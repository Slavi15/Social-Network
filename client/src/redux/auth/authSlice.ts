import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from './authApi';
import type { RootState } from '../store';
import type { IUser } from '../types/index';

export enum AuthStatus {
    IDLE = "IDLE",
    LOADING = "LOADING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED"
}

interface AuthState {
    user: IUser | null;
    accessToken: string | null;
    status: AuthStatus;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    status: AuthStatus.IDLE,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: IUser; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                api.endpoints.login.matchPending,
                (state) => {
                    state.status = AuthStatus.LOADING;
                }
            )
            .addMatcher(
                api.endpoints.login.matchFulfilled,
                (state, action) => {
                    state.status = AuthStatus.SUCCEEDED;
                    state.user = action.payload.user;
                    state.accessToken = action.payload.accessToken;
                }
            )
            .addMatcher(
                api.endpoints.login.matchRejected,
                (state, action) => {
                    state.status = AuthStatus.FAILED;
                    state.error = action.error.message || 'Login failed';
                }
            )
            .addMatcher(
                api.endpoints.register.matchPending,
                (state) => {
                    state.status = AuthStatus.LOADING;
                }
            )
            .addMatcher(
                api.endpoints.register.matchFulfilled,
                (state, action) => {
                    state.status = AuthStatus.SUCCEEDED;
                    state.user = action.payload.user;
                    state.accessToken = action.payload.accessToken;
                }
            )
            .addMatcher(
                api.endpoints.register.matchRejected,
                (state, action) => {
                    state.status = AuthStatus.FAILED;
                    state.error = action.error.message || 'Registration failed';
                }
            );
    },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;
