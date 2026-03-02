import axios from 'axios';
import { http, API } from '@/config/axios';
import { getCurrentUser } from '../hooks/useUser';
import type { User } from '@/store/authStore.ts';

interface LoginCredentials {
    email: string;
    password: string;
    remember_me?: boolean;
}

interface LoginResponse {
    user: User;
    token: string;
}

interface LoginApiResponse {
    data: {
        userId: number;
        name: string;
        url: string;
        dataProvidersUrl: string;
    };
    token: string;
}

interface ApiErrorResponse {
    message: string;
}

const FALLBACK_IDP = 'https://dashboard.core.ac.uk';

// Initialize axios with token if it exists
const initializeAxios = () => {
    const token = localStorage.getItem('auth-token');
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

// Call initialization
initializeAxios();

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
            // Try main identity provider first
            const response = await http.post<LoginApiResponse>('/login_check', formData, config);

            if (!response.data.token) {
                throw new Error('Login response missing token');
            }

            localStorage.setItem('auth-token', response.data.token);
            const userData = await getCurrentUser();

            return {
                token: response.data.token,
                user: userData
            };
        } catch (error) {
            // Only try fallback on 403 errors
            if (axios.isAxiosError<ApiErrorResponse>(error) && error.response?.status === 403) {
                const fallbackResponse = await http.post<LoginApiResponse>(`${FALLBACK_IDP}/login_check`, formData, config);

                if (!fallbackResponse.data.token) {
                    throw new Error('Fallback login response missing token');
                }

                localStorage.setItem('auth-token', fallbackResponse.data.token);
                API.defaults.headers.common['Authorization'] = `Bearer ${fallbackResponse.data.token}`;

                const userData = await getCurrentUser();

                return {
                    token: fallbackResponse.data.token,
                    user: userData
                };
            }

            // Let the error bubble up - auth store will handle user-friendly messages
            throw error;
        }
    },

    async logout(): Promise<void> {
        try {
            await http.post('/logout', {}, { withCredentials: true });
        } finally {
            localStorage.removeItem('auth-token');
            delete API.defaults.headers.common['Authorization'];
        }
    },

    async checkAuthAndGetUser(): Promise<User | null> {
        const token = localStorage.getItem('auth-token');
        if (!token) return null;

        try {
            return await getCurrentUser();
        } catch {
            localStorage.removeItem('auth-token');
            delete API.defaults.headers.common['Authorization'];
            return null;
        }
    },

    async requestResetToken(data: { email: string }): Promise<void> {
        await http.post('/internal/auth/reset', data);
    },
};
