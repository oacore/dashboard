import { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import classNames from 'classnames';
import Markdown from '@components/common/Markdown/Markdown.tsx';
import '../styles.css';

const { TextArea } = Input;

interface HarvestingModalProps {
    title: string;
    description: string;
    handleButtonClick: (text: string) => void;
    handleButtonClose: () => void;
    placeholder: string;
}

const HarvestingModal = ({
    title,
    description,
    handleButtonClick,
    handleButtonClose,
    placeholder,
}: HarvestingModalProps) => {
    const [requestText, setRequestText] = useState('');
    const [error, setError] = useState('');

    const validateAndSend = () => {
        if (!requestText.trim()) {
            setError('This field is mandatory');
        } else {
            setError('');
            handleButtonClick(requestText);
        }
    };

    return (
        <div>
            <Modal
                open={true}
                onCancel={handleButtonClose}
                footer={null}
                closable={false}
                aria-label="modal"
                className="harvesting-modal"
                rootClassName="harvesting-modal-root"
                width="100%"
                centered
            >
                <div className="modal-wrapper">
                    <h5 className="modal-title">{title}</h5>
                    <Markdown className="modal-description">{description}</Markdown>
                    <TextArea
                        id="request"
                        className={classNames('modal-input', { error: error })}
                        placeholder={placeholder}
                        name="request"
                        value={requestText}
                        onChange={(e) => setRequestText(e.target.value)}
                        rows={4}
                        required
                    />
                    <div className="form-footer">
                        {error && <span className="error-message-text">{error}</span>}
                        <span className="word-count">Max 150 words.</span>
                    </div>
                    <div className="button-group">
                        <Button
                            onClick={validateAndSend}
                            type="primary"
                            className="indexing-button"
                        >
                            Send
                        </Button>
                        <Button
                            type="text"
                            onClick={handleButtonClose}
                            className="indexing-button"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default HarvestingModal;

