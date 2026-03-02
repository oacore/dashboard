/**
 * Utility functions for calculating modal position
 */

interface Position {
    top: number;
    left: number;
}

interface PositionResult {
    position: Position;
    arrowTop: number;
}

const MODAL_WIDTH = 320;
const MODAL_HEIGHT = 350;
const SIDEBAR_WIDTH = 225;
const MARGIN = 20;
const MIN_MARGIN = 10;
const BOTTOM_SPACING_STEPS_3_4 = 40;

export const calculateModalPosition = (
    targetElement: HTMLElement | null,
    step?: number
): PositionResult | null => {
    if (!targetElement) {
        return null;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const targetCenterY = targetRect.top + targetRect.height / 2;

    const verticalOffset = (step === 3 || step === 4) ? BOTTOM_SPACING_STEPS_3_4 : 0;
    let topPosition = targetCenterY - MODAL_HEIGHT / 2 - verticalOffset;

    const bottomMargin = (step === 3 || step === 4) ? BOTTOM_SPACING_STEPS_3_4 : MIN_MARGIN;

    if (topPosition < MIN_MARGIN) {
        topPosition = MIN_MARGIN;
    }
    if (topPosition + MODAL_HEIGHT > viewportHeight - bottomMargin) {
        topPosition = viewportHeight - MODAL_HEIGHT - bottomMargin;
    }

    const arrowPosition = targetCenterY - topPosition;
    const leftPosition = Math.min(
        SIDEBAR_WIDTH + MARGIN,
        viewportWidth - MODAL_WIDTH - MARGIN
    );

    return {
        position: {
            top: topPosition,
            left: leftPosition,
        },
        arrowTop: arrowPosition,
    };
};

export const getCenterPosition = (): Position => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    return {
        top: viewportHeight / 2 - MODAL_HEIGHT / 2,
        left: viewportWidth / 2 - MODAL_WIDTH / 2,
    };
};

