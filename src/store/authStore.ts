import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';

export interface User {
    id: string;
    email: string;
    name?: string;
    acceptedTCVersion: number;
    organisationId?: number;
}

type AuthErrorType = 'unauthorized' | 'forbidden' | 'network' | 'unknown';

interface AuthError {
    type: AuthErrorType;
    message: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasCheckedAuth: boolean;
}

export interface AuthActions {
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    logout: () => void;
    clearSession: () => void;
    clearError: () => void;
    setUser: (user: User) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            hasCheckedAuth: false,

            login: async (email: string, password: string, rememberMe: boolean = true) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login({ email, password, remember_me: rememberMe });

                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        hasCheckedAuth: true,
                    });

                } catch (error) {
                    let errorMessage = 'Login failed';

                    if (error && typeof error === 'object' && 'type' in error) {
                        const authError = error as AuthError;
                        switch (authError.type) {
                            case 'unauthorized':
                                errorMessage = 'The username or password you entered is incorrect.';
                                break;
                            case 'forbidden':
                                errorMessage = 'User does not have access to this version.';
                                break;
                            case 'network':
                                errorMessage = 'Network error. Please check your connection.';
                                break;
                            case 'unknown':
                                errorMessage = authError.message;
                                break;
                            default:
                                errorMessage = 'An unexpected error occurred.';
                        }
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await authService.logout();
                } catch {
                    // logout even if API call fails
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                        hasCheckedAuth: false,
                    });
                }
            },

            /**
             * Clears auth state without calling the logout API.
             * Use when handling 401 to avoid triggering another request.
             */
            clearSession: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    hasCheckedAuth: false,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            setUser: (user: User) => {
                set({ user, isAuthenticated: true, hasCheckedAuth: true });
            },

            checkAuth: async () => {
                const state = get();

                // If we already have user data and have checked auth, don't make another API call
                if (state.hasCheckedAuth && state.user && state.isAuthenticated) {
                    return;
                }

                try {
                    // Check if we have a valid token and can fetch user data
                    const userData = await authService.checkAuthAndGetUser();

                    if (userData) {
                        set({
                            user: userData,
                            isAuthenticated: true,
                            isLoading: false,
                            hasCheckedAuth: true,
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            hasCheckedAuth: true,
                        });
                    }
                } catch {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        hasCheckedAuth: true,
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                hasCheckedAuth: state.hasCheckedAuth,
            }),
        }
    )
);
