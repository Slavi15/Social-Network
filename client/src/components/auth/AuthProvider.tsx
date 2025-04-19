import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useRefreshTokenMutation } from '../../redux/auth/authApi';
import { AppDispatch } from '../../redux/store';
import { setCredentials } from '../../redux/auth/authSlice';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch: AppDispatch = useDispatch();
    const [refreshToken] = useRefreshTokenMutation();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                const { accessToken, user } = await refreshToken().unwrap();
                dispatch(setCredentials({ user, accessToken }));
            } catch (error) {
                console.log('Token refresh failed', error);
            }
        };

        verifyRefreshToken();
    }, [dispatch, refreshToken]);

    return <>{children}</>;
};