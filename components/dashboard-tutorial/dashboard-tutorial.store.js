import create from 'zustand'

const useDashboardGuideStore = create((set) => ({
  currentStep: 1,
  isModalOpen: false,
  openModal: () => set(() => ({ isModalOpen: true })),
  closeModal: () => set(() => ({ isModalOpen: false, currentStep: 0 })),
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: state.currentStep - 1,
    })),
}))
export default useDashboardGuideStore
