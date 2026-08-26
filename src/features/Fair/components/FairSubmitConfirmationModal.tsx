import { Markdown } from '@oacore/core-ui';
import fairTexts from '@features/Fair/texts/fair.json';
import { Button, Modal } from 'antd';

import '../styles.css';
import successEmail from '@/assets/icons/SuccessEmail.svg';

type FairSubmitModalTexts = {
  confirm: {
    title: string;
    description: string;
    submitLabel: string;
    cancelLabel: string;
    ariaLabel: string;
  };
  success: {
    title: string;
    description: string;
    closeLabel: string;
    ariaLabel: string;
  };
};

export type FairSubmitConfirmationModalProps = {
  open: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export const FairSubmitConfirmationModal = ({
  open,
  isSubmitted,
  isSubmitting,
  onConfirm,
  onClose,
}: FairSubmitConfirmationModalProps) => {
  const { confirm, success } = (
    fairTexts.principlesAccordion as typeof fairTexts.principlesAccordion & {
      submitModal: FairSubmitModalTexts;
    }
  ).submitModal;

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  const handleConfirm = () => {
    void onConfirm();
  };

  return (
    <Modal
      aria-label={isSubmitted ? success.ariaLabel : confirm.ariaLabel}
      className="fair-submit-modal"
      closable={false}
      footer={null}
      mask={{ closable: !isSubmitting }}
      onCancel={handleClose}
      open={open}
      rootClassName="fair-submit-modal-root"
      width={600}
    >
      {isSubmitted ? (
        <div className="fair-submit-modal__success">
          <h5 className="fair-submit-modal__title">{success.title}</h5>
          <div className="feedback-success-icon-wrapper">
            <img src={successEmail} alt="" />
          </div>
          <Markdown className="fair-submit-modal__description">{success.description}</Markdown>
          <div className="fair-submit-modal__actions">
            <Button
              aria-label={success.closeLabel}
              className="fair-submit-modal__close-button"
              htmlType="button"
              onClick={handleClose}
              type="primary"
            >
              {success.closeLabel}
            </Button>
          </div>
        </div>
      ) : (
        <div className="fair-submit-modal__confirm">
          <h5 className="fair-submit-modal__title">{confirm.title}</h5>
          <Markdown className="fair-submit-modal__description">{confirm.description}</Markdown>
          <div className="fair-submit-modal__actions">
            <Button
              aria-label={confirm.submitLabel}
              disabled={isSubmitting}
              htmlType="button"
              loading={isSubmitting}
              onClick={handleConfirm}
              type="primary"
            >
              {confirm.submitLabel}
            </Button>
            <Button
              aria-label={confirm.cancelLabel}
              disabled={isSubmitting}
              htmlType="button"
              onClick={handleClose}
              type="text"
            >
              {confirm.cancelLabel}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
