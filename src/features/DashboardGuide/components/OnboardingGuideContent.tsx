import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import '../styles.css';

interface OnboardingGuideContentProps {
    headerTitle?: string;
    content: React.ReactNode;
    onNext: () => void;
    onPrev: () => void;
    customFooter?: React.ReactNode;
    customHeaderTitle?: string;
    page: number;
    from: number;
    hideRightArrow?: boolean;
    hideLeftArrow?: boolean;
}

const OnboardingGuideContent: React.FC<OnboardingGuideContentProps> = ({
    headerTitle,
    content,
    onNext,
    onPrev,
    customFooter,
    customHeaderTitle,
    page,
    from,
    hideRightArrow,
    hideLeftArrow,
}) => (
    <div className="onboarding-content-wrapper">
        <div className="onboarding-modal-header">
            <div
                className={classNames('onboarding-header-title', {
                    'onboarding-small-title': customHeaderTitle,
                })}
            >
                {headerTitle || customHeaderTitle}
            </div>

            <div className="onboarding-button-wrap">
                {!hideLeftArrow && (
                    <Button
                        type="text"
                        className="onboarding-arrow-button"
                        onClick={onPrev}
                        icon={<ArrowLeftOutlined />}
                        aria-label="Previous step"
                    />
                )}
                <div className="onboarding-page-counter">
                    {page}
                    <span className="onboarding-separator">of</span>
                    {from}
                </div>
                {!hideRightArrow && (
                    <Button
                        type="text"
                        className="onboarding-arrow-button"
                        onClick={onNext}
                        icon={<ArrowRightOutlined />}
                        aria-label="Next step"
                    />
                )}
            </div>
        </div>
        <div className="onboarding-content">
            <div>{content}</div>
        </div>
        {customFooter && <div className="onboarding-footer">{customFooter}</div>}
    </div>
);

export default OnboardingGuideContent;

