import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import classNames from 'classnames';
import { useTutorialStore } from '@features/DashboardGuide/store/tutorialStore.ts';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useModalPositioning } from './hooks/useModalPositioning';
import { StepContent } from './components/StepContent';
import './styles.css';

const DashboardGuide: React.FC = () => {
    const tutorial = useTutorialStore();
    const { isModalOpen, currentStep, nextStep, prevStep, closeModal, shouldAutoOpen, openModal } = tutorial;
    const { isLoaded, isLoading } = useDataProviderStore();
    const hasAutoOpened = useRef(false);

    // Auto-open tutorial after data providers are loaded
    useEffect(() => {
        if (!hasAutoOpened.current && !isLoading && isLoaded && shouldAutoOpen()) {
            hasAutoOpened.current = true;
            openModal();
        }
    }, [isLoading, isLoaded, shouldAutoOpen, openModal]);

    // Handle modal positioning for steps 2-4
    const { position, arrowTop } = useModalPositioning(currentStep, isModalOpen);

    const handleSkip = () => {
        closeModal();
    };

    const handleNext = () => {
        if (currentStep !== 4) {
            nextStep();
        } else {
            handleSkip();
        }
    };

    const modalStyle: React.CSSProperties = currentStep === 1 ? {} : {
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'none',
        margin: 0,
    };

    const arrowStyle: React.CSSProperties = (arrowTop === null || currentStep === 1)
        ? { display: 'none' }
        : { top: `${arrowTop}px`, transform: 'translateY(-50%)' };

    if (!isModalOpen) {
        return null;
    }

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleNext}
            footer={null}
            closable={false}
            width={currentStep === 1 ? 600 : 320}
            className={classNames('dashboard-guide-modal', {
                'dashboard-guide-modal-center': currentStep === 1,
                'dashboard-guide-modal-small': currentStep !== 1,
                'dashboard-guide-modal-positioned': currentStep !== 1,
            })}
            style={modalStyle}
            transitionName=""
            maskTransitionName=""
        >
            <div
                className={classNames('dashboard-guide-arrow', {
                    'dashboard-guide-arrow-none': currentStep === 1,
                })}
                style={arrowStyle}
            />
            <StepContent
                step={currentStep}
                onNext={handleNext}
                onPrev={prevStep}
                onSkip={handleSkip}
            />
        </Modal>
    );
};

export default DashboardGuide;
