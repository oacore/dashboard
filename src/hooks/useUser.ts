import useSWR from 'swr';
import { createSWRKey, fetcher, swrDefaultConfig } from '@config/swr.ts';
import { http } from '@/config/axios';
import type { User } from '@/store/authStore';
import { useAuthStore } from '@/store/authStore';

// Shared function to fetch current user (can be used in both hooks and services)
export const getCurrentUser = async (): Promise<User> => {
    try {
        const response = await fetcher('/internal/user').then(res => res as User);
        return response;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

// Hook for React components
export const useCurrentUser = () => {
    const { setUser } = useAuthStore();
    const key = createSWRKey('/internal/user');

    const { data, error, isLoading, mutate } = useSWR<User>(
        key,
        () => getCurrentUser(),
        {
            ...swrDefaultConfig,
            onSuccess: (userData) => {
                setUser(userData);
            },
        },
    );

    return {
        data,
        user: data, // Alias for convenience
        error,
        isLoading,
        mutate,
        isError: !!error,
        isEmpty: !isLoading && !error && !data,
    };
};

// Service function for updating user
export const updateUser = async (patch: Partial<User>): Promise<User> => {
    try {
        const response = await http.patch<User>('/internal/user', patch, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

// export const useUpdateUser = () => {
//     const updateUser = async (patch: Partial<User>) => {
//         try {
//             const response = await http.patch<User>('/internal/user', patch, {
//                 withCredentials: true,
//             });
//             return response.data;
//         } catch (error) {
//             console.error('Error updating user data:', error);
//             throw new Error(error instanceof Error ? error.message : 'Failed to update user');
//         }
//     };
//
//     return {
//         updateUser,
//     };
// };
