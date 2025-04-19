import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from './authApi';
import { selectCurrentUser, selectCurrentToken, setCredentials, logout } from './authSlice';
import type { AppDispatch } from '../store';
import type { SerializedError } from '@reduxjs/toolkit';
import { IUser } from '../types';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { usePersistStore } from '../hooks/usePersistStore';

type AuthResponse<T = undefined> = {
    success: boolean;
    error?: SerializedError;
    data?: T;
    message?: string;
};

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const { isRehydrated } = usePersistStore();

    const [loginApi] = useLoginMutation();
    const [registerApi] = useRegisterMutation();
    const [logoutApi] = useLogoutMutation();

    const handleLogin = async (credentials: LoginRequest): Promise<AuthResponse<{ user: IUser; token: string }>> => {
        try {
            const response = await loginApi(credentials).unwrap();
            dispatch(setCredentials(response));
            return {
                success: true,
                data: {
                    user: response.user,
                    token: response.accessToken
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error as SerializedError,
                message: (error as any)?.data?.message || 'Login failed'
            };
        }
    };

    const handleRegister = async (userData: RegisterRequest): Promise<AuthResponse<{ user: IUser; token: string }>> => {
        try {
            const response = await registerApi(userData).unwrap();
            dispatch(setCredentials(response));
            return {
                success: true,
                data: {
                    user: response.user,
                    token: response.accessToken
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error as SerializedError,
                message: (error as any)?.data?.message || 'Registration failed'
            };
        }
    };

    const handleLogout = async (): Promise<AuthResponse> => {
        try {
            await logoutApi().unwrap();
            dispatch(logout());
            return {
                success: true,
                message: "Logged out successfully"
            };
        } catch (error) {
            return {
                success: false,
                error: error as SerializedError,
                message: "Logout failed"
            };
        }
    };

    return {
        user,
        token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: !!token && isRehydrated
    };
};