import { create } from 'zustand';

interface TutorialState {
    isModalOpen: boolean;
    currentStep: number;
}

interface TutorialActions {
    openModal: () => void;
    closeModal: () => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    shouldAutoOpen: () => boolean;
}

type TutorialStore = TutorialState & TutorialActions;

export const useTutorialStore = create<TutorialStore>((set) => ({
    isModalOpen: false,
    currentStep: 1,

    openModal: () => {
        set({ isModalOpen: true, currentStep: 1 });
    },

    closeModal: () => {
        localStorage.setItem('onboardingDone', 'true');
        set({ isModalOpen: false });
    },

    shouldAutoOpen: () => {
        const onboardingDone = localStorage.getItem('onboardingDone');
        return onboardingDone !== 'true';
    },

    nextStep: () => {
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, 4),
        }));
    },

    prevStep: () => {
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 1),
        }));
    },

    reset: () => {
        set({ currentStep: 1, isModalOpen: false });
    },
}));

