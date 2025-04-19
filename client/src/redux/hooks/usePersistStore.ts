import { useEffect, useState } from 'react';
import { persistor } from '../store';

export const usePersistStore = () => {
    const [isRehydrated, setIsRehydrated] = useState(false);

    useEffect(() => {
        const unsubscribe = persistor.subscribe(() => {
            const { bootstrapped } = persistor.getState();
            if (bootstrapped) {
                setIsRehydrated(true);
                unsubscribe();
            }
        });

        if (persistor.getState().bootstrapped) {
            setIsRehydrated(true);
        }

        return () => unsubscribe();
    }, []);

    return { isRehydrated };
};