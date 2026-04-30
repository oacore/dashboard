import React, { useState, useCallback } from 'react';
import { Button, Modal, Input } from 'antd';
import { MessageFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import type { User } from '@/store/authStore';
import type { DataProvider } from '@hooks/useDataProviders';
import { useSendFeedback } from '@components/common/FeedbackButton/hooks/useSendFeedback.ts';
import { TextData } from './texts';
import './styles.css';
import successEmail from '@/assets/icons/SuccessEmail.svg';
import { captureHandledError } from '@/utils/captureHandledError';

const { TextArea } = Input;

const FEEDBACK_WORDS_MAX = 150;
const FEEDBACK_TEXT_MAX_LENGTH = 1500;

const content = TextData.feedback;

interface FeedbackButtonProps {
    user: User;
    dataProvider: DataProvider | null;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
    user,
    dataProvider,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const { sendFeedback } = useSendFeedback();

    const handleFeedbackClick = useCallback(() => {
        setIsModalOpen(true);
        setFeedbackText('');
        setIsSubmitted(false);
        setError('');
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setFeedbackText('');
        setIsSubmitted(false);
        setError('');
    }, []);

    const getWordCount = (text: string): number => {
        return text.trim().split(/\s+/).filter(Boolean).length;
    };

    const handleSubmit = useCallback(async () => {
        const trimmed = feedbackText.trim();
        if (!trimmed) {
            setError('Please enter your feedback');
            return;
        }

        const wordCount = getWordCount(trimmed);
        if (wordCount > FEEDBACK_WORDS_MAX) {
            setError('Feedback must be 150 words or less');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const feedbackData = {
                userEmail: user?.email || 'No email available',
                repositoryNumber: dataProvider?.id ?? 'No repository ID available',
                page: location.pathname,
                feedbackText: trimmed,
            };

            await sendFeedback(feedbackData);
            setIsSubmitted(true);
        } catch (err) {
            captureHandledError(err, {
                tags: { feature: 'feedback', action: 'submit' },
                extra: { feedbackText, userEmail: user?.email, repositoryNumber: dataProvider?.id, page: location.pathname },
            });
            setError('Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [feedbackText, user?.email, dataProvider?.id, location.pathname, sendFeedback]);

    const handleTextChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFeedbackText(e.target.value);
            setError('');
        },
        []
    );

    const wordCount = getWordCount(feedbackText);
    const isOverWordLimit = wordCount > FEEDBACK_WORDS_MAX;

    return (
        <>
            <div className="feedback-container">
                <Button
                    type="primary"
                    className="feedback-button"
                    onClick={handleFeedbackClick}
                    aria-label="Provide feedback"
                    icon={<MessageFilled className="feedback-icon" />}
                >
                    <span className="feedback-button-text">Feedback</span>
                </Button>
            </div>

            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                closable={false}
                aria-label="Feedback modal"
                className="feedback-modal"
                rootClassName="feedback-modal-root"
            >
                {!isSubmitted ? (
                    <div className="feedback-form-wrapper">
                        <h5 className="feedback-modal-title">
                            {content.form.title}
                        </h5>
                        <p className="feedback-modal-description">
                            {content.form.description}
                        </p>

                        <TextArea
                            className={`feedback-textarea ${(error || isOverWordLimit) ? 'feedback-textarea-error' : ''}`}
                            placeholder={content.form.placeholder}
                            value={feedbackText}
                            onChange={handleTextChange}
                            maxLength={FEEDBACK_TEXT_MAX_LENGTH}
                            rows={6}
                            disabled={isSubmitting}
                        />

                        <div className="feedback-form-footer">
                            {(error || isOverWordLimit) && (
                                <span className="feedback-error-message">
                                    {error || 'Feedback must be 150 words or less'}
                                </span>
                            )}
                            <span className="feedback-word-count">
                                Max 150 words.
                            </span>
                        </div>

                        <div className="feedback-button-group">
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                disabled={!feedbackText.trim() || isSubmitting || isOverWordLimit}
                                loading={isSubmitting}
                            >
                                {content.actions.onAction.title}
                            </Button>
                            <Button onClick={handleCloseModal}>
                                {content.actions.offAction.title}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="feedback-success-wrapper">
                        <h5 className="feedback-modal-title">
                            {content.success.title}
                        </h5>
                        <div className="feedback-success-icon-wrapper">
                            <img src={successEmail} alt="" />
                        </div>
                        <p className="feedback-modal-description">
                            {content.success.description}
                        </p>

                        <div className="feedback-button-group">
                            <Button
                                type="primary"
                                onClick={handleCloseModal}
                                className="feedback-close-button"
                            >
                                {content.success.action.title}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
