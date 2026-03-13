import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ChangePasswordState {
    isChanging: boolean;
    error: string | null;
    successMessage: string | null;
}

interface ChangePasswordActions {
    setChanging: (changing: boolean) => void;
    setError: (error: string | null) => void;
    setSuccessMessage: (message: string | null) => void;
    clearMessages: () => void;
}

type ChangePasswordStore = ChangePasswordState & ChangePasswordActions;

export const useChangePasswordStore = create<ChangePasswordStore>()(
    devtools(
        (set) => ({
            // Initial state
            isChanging: false,
            error: null,
            successMessage: null,

            // Actions
            setChanging: (isChanging) => {
                set({ isChanging });
            },

            setError: (error) => {
                set({ error });
            },

            setSuccessMessage: (successMessage) => {
                set({ successMessage });
            },

            clearMessages: () => {
                set({ error: null, successMessage: null });
            },
        }),
        {
            name: 'change-password-store',
        }
    )
);

