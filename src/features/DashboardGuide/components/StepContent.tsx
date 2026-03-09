import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Markdown } from '@core/core-ui';
import OnboardingGuideContent from './OnboardingGuideContent';
import { getStepConfig, TOTAL_STEPS } from '../config/stepsConfig';
import { useDataProviderStore } from '@/store/dataProviderStore';
import texts from '../texts';
import "../styles.css"

interface StepContentProps {
    step: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
}

export const StepContent: React.FC<StepContentProps> = ({
    step,
    onNext,
    onPrev,
    onSkip,
}) => {
    const navigate = useNavigate();
    const { selectedDataProvider } = useDataProviderStore();
    const config = getStepConfig(step, selectedDataProvider?.id);

    if (!config) {
        return null;
    }

    const handleContinue = () => {
        if (config.navigatePath) {
            navigate(config.navigatePath);
            onSkip();
        } else {
            config.onContinue();
        }
    };

    if (step === 1) {
        return (
            <OnboardingGuideContent
                headerTitle={config.title}
                page={1}
                from={TOTAL_STEPS}
                hideLeftArrow
                onNext={onNext}
                onPrev={onPrev}
                content={<FirstStepContent />}
                customFooter={
                    <div className="dashboard-guide-button-group">
                        <Button type="text" onClick={onSkip}>
                            {config.actions[0].skipCaption}
                        </Button>
                        <Button type="primary" onClick={onNext}>
                            {config.actions[1].ContinueCaption}
                        </Button>
                    </div>
                }
            />
        );
    }

    return (
        <OnboardingGuideContent
            customHeaderTitle={config.title}
            page={step}
            from={TOTAL_STEPS}
            hideRightArrow={step === TOTAL_STEPS}
            onNext={onNext}
            onPrev={onPrev}
            content={
                <div className="dashboard-guide-small-modal-wrapper">
                    <div className="dashboard-guide-modal-image-wrapper">
                        <img src={config.image} alt="" />
                    </div>
                    <div className="dashboard-guide-modal-body-wrapper">
                        <div className="dashboard-guide-small-upload-text">{config.text}</div>
                    </div>
                </div>
            }
            customFooter={
                <div className="dashboard-guide-small-button-group">
                    <Button type="text" onClick={onSkip}>
                        {config.actions[0].skipCaption}
                    </Button>
                    <Button type="primary" onClick={handleContinue}>
                        {config.actions[1].ContinueCaption}
                    </Button>
                </div>
            }
        />
    );
};

const FirstStepContent: React.FC = () => {
    const stepConfig = getStepConfig(1);

    return (
        <div className="dashboard-guide-modal-wrapper">
            <div className="dashboard-guide-modal-body-wrapper">
                <div className="dashboard-guide-modal-body-item">
                    <div className="dashboard-guide-list-wrapper">
                        <span>{texts.title}</span>
                        <ul className="dashboard-guide-list">
                            {Object.values(texts.services)?.map((service, index) => (
                                <li key={index}>{service?.title}</li>
                            ))}
                        </ul>
                    </div>
                    <Markdown>{texts.request}</Markdown>
                </div>
            </div>
            <div className="dashboard-guide-modal-image-wrapper">
                <img src={stepConfig?.image || '/src/assets/icons/core-symbol.svg'} alt="" />
            </div>
        </div>
    );
};

