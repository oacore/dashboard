import axios from 'axios';
import { http } from '@/config/axios';
import { getCurrentUser } from '../hooks/useUser';
import type { User } from '@/store/authStore.ts';

interface LoginCredentials {
    email: string;
    password: string;
    remember_me?: boolean;
}

interface LoginResponse {
    user: User;
}

interface ApiErrorResponse {
    message: string;
}

const FALLBACK_IDP = 'https://dashboard.core.ac.uk';

/**
 * Cookie-based auth flow (like legacy flow):
 * - credentials: 'include' sends cookies with requests
 * - Server sets session cookies via Set-Cookie on login
 * - Browser sends cookies automatically on subsequent requests
 * - No token in localStorage; session lives in cookies
 */
export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const formData = new URLSearchParams({
            email: credentials.email,
            password: credentials.password,
            remember_me: credentials.remember_me !== false ? 'on' : 'off',
        });

        const config = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            withCredentials: true,
        };

        try {
            await http.post('/login_check', formData, config);
            // Server sets session cookies in response; browser stores them
            const userData = await getCurrentUser();

            return { user: userData };
        } catch (error) {
            // Only try fallback on 403 errors (forbidden - user doesn't have access)
            if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.status === 403) {
                await http.post(`${FALLBACK_IDP}/login_check`, formData, config);
                const userData = await getCurrentUser();

                return { user: userData };
            }

            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            await http.post('/logout', {}, { withCredentials: true });
        } finally {
            // Server clears session; no client-side token to remove
        }
    },

    async checkAuthAndGetUser(): Promise<User | null> {
        try {
            return await getCurrentUser();
        } catch {
            return null;
        }
    },

    async requestResetToken(data: { email: string }): Promise<void> {
        await http.post('/internal/auth/reset', data);
    },
};
