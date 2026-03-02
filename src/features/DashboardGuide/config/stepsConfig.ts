import texts from '../texts';

const firstStep = '/src/assets/icons/stepFirst.svg';
const secondStep = '/src/assets/icons/stepTwo.svg';
const thirdStep = '/src/assets/icons/stepThree.svg';
const forthStep = '/src/assets/icons/stepFour.svg';

export interface StepConfig {
    title: string;
    image: string;
    text: string;
    actions: Array<{
        skipCaption?: string;
        skipVariant?: string;
        ContinueCaption?: string;
        ContinueVariant?: string;
    }>;
    onContinue: () => void;
    /** Path for client-side navigation (avoids full page reload) */
    navigatePath?: string;
}

const stepConfigs: Record<number, Omit<StepConfig, 'onContinue' | 'navigatePath'>> = {
    1: {
        title: texts.mainTitle,
        image: firstStep,
        text: '',
        actions: texts.actions,
    },
    2: {
        title: texts.uploadMainTitle,
        image: secondStep,
        text: texts.uploadText,
        actions: texts.uploadActions,
    },
    3: {
        title: texts.mappingMainTitle,
        image: thirdStep,
        text: texts.mappingText,
        actions: texts.mappingActions,
    },
    4: {
        title: texts.inviteMainTitle,
        image: forthStep,
        text: texts.inviteText,
        actions: texts.inviteActions,
    },
};

export const getStepConfig = (step: number, dataProviderId?: number): StepConfig | null => {
    const config = stepConfigs[step];
    if (!config) return null;

    const basePath = dataProviderId
        ? `/data-providers/${dataProviderId}`
        : '';

    const navigatePathsByStep: Record<number, string> = {
        2: `${basePath}/repository?referrer=upload`,
        3: `${basePath}/repository?referrer=mapping`,
        4: `${basePath}/organisational?referrer=invite`,
    };

    const navigatePath = navigatePathsByStep[step];
    const onContinue = navigatePath ? () => {} : () => {};

    return {
        ...config,
        onContinue,
        navigatePath,
    };
};

export const TOTAL_STEPS = 4;

