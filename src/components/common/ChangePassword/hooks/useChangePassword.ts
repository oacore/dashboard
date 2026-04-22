import { message } from 'antd';
import { postRequestFetcher } from '@/config/swr';
import { useChangePasswordStore } from '../store/changePasswordStore';
import { captureHandledError } from '@/utils/captureHandledError';
import axios from 'axios';

interface ChangePasswordData {
    email: string;
    password?: string;
    newPassword: string;
    newPasswordAgain: string;
    token?: string;
}

export const useChangePassword = () => {
    const {
        isChanging,
        error,
        successMessage,
        setChanging,
        setError,
        setSuccessMessage,
        clearMessages,
    } = useChangePasswordStore();

    const changePassword = async (data: ChangePasswordData): Promise<{ message: string; type: 'success' | 'error' }> => {
        if (!data.email) {
            const errorMsg = 'Email is required';
            setError(errorMsg);
            return { message: errorMsg, type: 'error' };
        }

        const isResetFlow = Boolean(data.token);

        if (!isResetFlow && !data.password) {
            const errorMsg = 'Current password is required';
            setError(errorMsg);
            return { message: errorMsg, type: 'error' };
        }

        setChanging(true);
        clearMessages();

        const requestData: Record<string, string> = {
            email: data.email,
            newPassword: data.newPassword,
            newPasswordAgain: data.newPasswordAgain,
        };

        if (isResetFlow && data.token) {
            requestData.confirmationToken = data.token;
        } else if (!isResetFlow && data.password) {
            requestData.password = data.password;
        }

        try {
            await postRequestFetcher('/internal/auth/change', requestData, true);

            const successMsg = 'Password changed successfully.';
            setSuccessMessage(successMsg);
            message.success(successMsg);
            return { message: successMsg, type: 'success' };
        } catch (error: unknown) {
            const httpStatus = axios.isAxiosError(error) ? error.response?.status : undefined;
            captureHandledError(error, {
                tags: { feature: 'auth', action: 'change_password' },
                extra: { isResetFlow, httpStatus },
            });

            let errorMessage = isResetFlow
                ? 'Password reset error. Please request reset password again!'
                : 'Failed to change password. Please try again.';

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    errorMessage = 'Wrong credentials';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }

            setError(errorMessage);
            message.error(errorMessage);
            return { message: errorMessage, type: 'error' };
        } finally {
            setChanging(false);
        }
    };

    return {
        changePassword,
        isChanging,
        error,
        successMessage,
        clearMessages,
    };
};

