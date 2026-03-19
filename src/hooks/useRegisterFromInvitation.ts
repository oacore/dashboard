import useSWRMutation from 'swr/mutation';
import axios from 'axios';
import { authService } from '@/services/auth.service';

const REGISTER_INVITATION_KEY = 'auth/register-invitation';

interface RegisterFromInvitationArg {
    email: string;
    password: string;
    invitationCode: string;
}

const registerFromInvitationFetcher = async (
    _key: string,
    { arg }: { arg: RegisterFromInvitationArg }
) => {
    await authService.registerFromInvitation(arg);
};

const ERROR_MESSAGES: Record<number, string> = {
    406: 'Invitation code is invalid.',
    409: 'It seems you have registered already. Please try to log in.',
};

export const useRegisterFromInvitation = () => {
    const { trigger, isMutating } = useSWRMutation(
        REGISTER_INVITATION_KEY,
        registerFromInvitationFetcher
    );

    const registerFromInvitation = async (data: RegisterFromInvitationArg) => {
        try {
            await trigger(data);
            return { success: true };
        } catch (err) {
            let errorMessage = 'Registration error. Please try again!';
            if (axios.isAxiosError(err) && err.response?.status) {
                errorMessage =
                    ERROR_MESSAGES[err.response.status] ?? errorMessage;
                if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            return { success: false, message: errorMessage };
        }
    };

    return {
        registerFromInvitation,
        isLoading: isMutating,
    };
};
