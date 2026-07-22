import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { authService } from '@/services/auth.service';
import { captureHandledError } from '@/utils/captureHandledError';

const RESET_TOKEN_KEY = 'auth/reset';

interface RequestResetArg {
    email: string;
}

const requestResetFetcher = async (_key: string, { arg }: { arg: RequestResetArg }) => {
    await authService.requestResetToken({ email: arg.email });
};

export const useRequestResetToken = () => {
    const { trigger, isMutating, error, reset } = useSWRMutation(
        RESET_TOKEN_KEY,
        requestResetFetcher,
    );

    const requestResetToken = async (email: string) => {
        try {
            await trigger({ email });
            return {
                success: true,
                message:
                    'We have just sent you an email with the instructions on how to reset your password. Please check your mailbox and follow the reset link.',
            };
        } catch (err) {
            const httpStatus = axios.isAxiosError(err) ? err.response?.status : undefined;
            captureHandledError(err, {
                tags: { feature: 'auth', action: 'request_reset_token' },
                extra: { httpStatus },
            });
            let errorMessage = 'Something went wrong. Please try again!';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            return {
                success: false,
                message: errorMessage,
            };
        }
    };

    return {
        requestResetToken,
        isLoading: isMutating,
        error,
        reset,
    };
};
