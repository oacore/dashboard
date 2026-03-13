import { postRequestFetcher } from '@/config/swr';

export interface FeedbackPayload {
    userEmail: string;
    repositoryNumber: string | number;
    page: string;
    feedbackText: string;
}

const FEEDBACK_ENDPOINT = '/internal/email/feedback';

export const useSendFeedback = () => {
    const sendFeedback = (payload: FeedbackPayload) =>
        postRequestFetcher(FEEDBACK_ENDPOINT, payload);

    return { sendFeedback };
};
