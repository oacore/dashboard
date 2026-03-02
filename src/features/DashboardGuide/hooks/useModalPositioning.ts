import { useState, useEffect } from 'react';
import { findTargetElement } from '../utils/targetElements';
import { calculateModalPosition, getCenterPosition } from '../utils/positionCalculator';

interface Position {
    top: number;
    left: number;
}

interface UseModalPositioningResult {
    position: Position;
    arrowTop: number | null;
}

/**
 * Hook to handle modal positioning for tutorial steps - instant positioning without animations
 */
export const useModalPositioning = (
    currentStep: number,
    isModalOpen: boolean
): UseModalPositioningResult => {
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const [arrowTop, setArrowTop] = useState<number | null>(null);

    useEffect(() => {
        if (!isModalOpen) return;

        // For step 1, use center position
        if (currentStep === 1) {
            const centerPos = getCenterPosition();
            setPosition(centerPos);
            setArrowTop(null);
            return;
        }

        // For steps 2-4, calculate position
        const targetElement = findTargetElement(currentStep);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'auto', block: 'center' });
        }

        const positionResult = calculateModalPosition(targetElement, currentStep);

        if (positionResult) {
            setPosition(positionResult.position);
            setArrowTop(positionResult.arrowTop);
        } else {
            setPosition(getCenterPosition());
            setArrowTop(null);
        }

        const handleResize = () => {
            const result = calculateModalPosition(findTargetElement(currentStep), currentStep);
            if (result) {
                setPosition(result.position);
                setArrowTop(result.arrowTop);
            } else {
                setPosition(getCenterPosition());
                setArrowTop(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isModalOpen, currentStep]);

    return { position, arrowTop };
};

