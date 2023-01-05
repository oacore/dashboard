import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import firstStep from '../upload/assets/images/stepFirst.png'
import secondStep from '../upload/assets/images/stepTwo.png'
import thirdStep from '../upload/assets/images/stepThree.png'
import forthStep from '../upload/assets/images/stepFour.png'
import OnboardingGuideContent from './dashboardGuideContent'
import useOnClickOutside from '../../utils/hooks/use-clickoutside'
import useDashboardGuideStore from './dashboard-tutorial.store'
import Markdown from '../markdown'

import * as texts from 'texts/depositing'

const DashboardGuide = ({ dataProviderData, modal, placement }) => {
  const [shouldRender, setShouldRender] = useState(false)
  const modalRef = useRef(null)
  const dashboardGuideStore = useDashboardGuideStore()

  useEffect(() => {
    const t = localStorage.getItem('onboardingDone')
    setShouldRender(t === 'true')
  }, [shouldRender])

  const handleSkip = () => {
    localStorage.setItem('onboardingDone', 'true')
    dashboardGuideStore.closeModal()
  }

  const renderNext = () => {
    if (dashboardGuideStore.currentStep !== 4) dashboardGuideStore.nextStep()
    else handleSkip()
  }

  useOnClickOutside(modalRef, renderNext)

  const navigateToPage = () => {
    window.location = `/data-providers/${dataProviderData.id}/settings?referrer=upload`
  }

  const navigateToMapping = () => {
    window.location = `/data-providers/${dataProviderData.id}/settings?referrer=mapping`
  }

  const navigateToInvite = () => {
    window.location = `/data-providers/${dataProviderData.id}/settings?referrer=invite`
  }

  return dashboardGuideStore.isModalOpen && !shouldRender ? (
    <div ref={modal}>
      <Modal
        onClose={() => dashboardGuideStore.closeModal()}
        hideManually
        aria-label="modal"
        className={classNames.use(styles.smallModal, {
          [styles.modal]: dashboardGuideStore.currentStep === 1,
          [styles[placement]]: placement,
        })}
      >
        <div
          className={classNames.use({
            [styles.arrowNone]: dashboardGuideStore.currentStep === 1,
            [styles.arrowBottom]: dashboardGuideStore.currentStep === 2,
            [styles.arrow]: dashboardGuideStore.currentStep === 3 || 4,
          })}
        />
        <div ref={modalRef}>
          {dashboardGuideStore.currentStep === 1 && (
            <OnboardingGuideContent
              headerTitle={texts.dashboardGuide.mainTitle}
              page={1}
              from={4}
              hideLeftArrow
              onNext={dashboardGuideStore.nextStep}
              onPrev={dashboardGuideStore.prevStep}
              content={
                <div className={styles.modalWrapper}>
                  <div className={styles.modalBodyWrapper}>
                    <div className={styles.modalBodyItem}>
                      <div className={styles.listWrapper}>
                        <span>{texts.dashboardGuide.title}</span>
                        <ul className={styles.list}>
                          {Object.values(texts.dashboardGuide.services)?.map(
                            (service) => (
                              <li>{service?.title}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <Markdown>{texts.dashboardGuide.request}</Markdown>
                    </div>
                  </div>
                  <div className={styles.modalImageWrapper}>
                    <img src={firstStep} alt="" />
                  </div>
                </div>
              }
              customFooter={
                <div className={styles.buttonGroup}>
                  <Button
                    variant={texts.dashboardGuide.actions[0].skipVariant}
                    key={texts.dashboardGuide.actions[0].skipCaption}
                    onClick={handleSkip}
                  >
                    {texts.dashboardGuide.actions[0].skipCaption}
                  </Button>
                  <Button
                    variant={texts.dashboardGuide.actions[1].ContinueVariant}
                    key={texts.dashboardGuide.actions[1].ContinueCaption}
                    onClick={dashboardGuideStore.nextStep}
                  >
                    {texts.dashboardGuide.actions[1].ContinueCaption}
                  </Button>
                </div>
              }
            />
          )}

          {dashboardGuideStore.currentStep === 2 && (
            <OnboardingGuideContent
              customHeaderTitle={texts.dashboardGuide.uploadMainTitle}
              page={2}
              from={4}
              onNext={dashboardGuideStore.nextStep}
              onPrev={dashboardGuideStore.prevStep}
              content={
                <div className={styles.smallModalWrapper}>
                  <div className={styles.modalImageWrapper}>
                    <img src={secondStep} alt="" />
                  </div>
                  <div className={styles.modalBodyWrapper}>
                    <div className={styles.smallUploadText}>
                      {texts.dashboardGuide.uploadText}
                    </div>
                  </div>
                </div>
              }
              customFooter={
                <div className={styles.smallButtonGroup}>
                  <Button
                    variant={texts.dashboardGuide.uploadActions[0].skipVariant}
                    key={texts.dashboardGuide.uploadActions[0].skipCaption}
                    onClick={handleSkip}
                  >
                    {texts.dashboardGuide.uploadActions[0].skipCaption}
                  </Button>
                  <Button
                    variant={
                      texts.dashboardGuide.uploadActions[1].ContinueVariant
                    }
                    key={texts.dashboardGuide.uploadActions[1].ContinueCaption}
                    onClick={navigateToPage}
                  >
                    {texts.dashboardGuide.uploadActions[1].ContinueCaption}
                  </Button>
                </div>
              }
            />
          )}

          {dashboardGuideStore.currentStep === 3 && (
            <OnboardingGuideContent
              customHeaderTitle={texts.dashboardGuide.mappingMainTitle}
              page={3}
              from={4}
              onNext={dashboardGuideStore.nextStep}
              onPrev={dashboardGuideStore.prevStep}
              content={
                <div className={styles.smallModalWrapper}>
                  <div className={styles.modalImageWrapper}>
                    <img src={thirdStep} alt="" />
                  </div>
                  <div className={styles.modalBodyWrapper}>
                    <div className={styles.smallUploadText}>
                      {texts.dashboardGuide.mappingText}
                    </div>
                  </div>
                </div>
              }
              customFooter={
                <div className={styles.smallButtonGroup}>
                  <Button
                    variant={texts.dashboardGuide.mappingActions[0].skipVariant}
                    key={texts.dashboardGuide.mappingActions[0].skipCaption}
                    onClick={handleSkip}
                  >
                    {texts.dashboardGuide.mappingActions[0].skipCaption}
                  </Button>
                  <Button
                    variant={
                      texts.dashboardGuide.mappingActions[1].ContinueVariant
                    }
                    key={texts.dashboardGuide.mappingActions[1].ContinueCaption}
                    onClick={navigateToMapping}
                  >
                    {texts.dashboardGuide.mappingActions[1].ContinueCaption}
                  </Button>
                </div>
              }
            />
          )}

          {dashboardGuideStore.currentStep === 4 && (
            <OnboardingGuideContent
              customHeaderTitle={texts.dashboardGuide.inviteMainTitle}
              page={4}
              from={4}
              hideRightArrow
              onNext={dashboardGuideStore.nextStep}
              onPrev={dashboardGuideStore.prevStep}
              content={
                <div className={styles.smallModalWrapper}>
                  <div className={styles.modalImageWrapper}>
                    <img src={forthStep} alt="" />
                  </div>
                  <div className={styles.modalBodyWrapper}>
                    <div className={styles.smallUploadText}>
                      {texts.dashboardGuide.inviteText}
                    </div>
                  </div>
                </div>
              }
              customFooter={
                <div className={styles.smallButtonGroup}>
                  <Button
                    variant={texts.dashboardGuide.inviteActions[0].skipVariant}
                    key={texts.dashboardGuide.inviteActions[0].skipCaption}
                    onClick={handleSkip}
                  >
                    {texts.dashboardGuide.inviteActions[0].skipCaption}
                  </Button>
                  <Button
                    variant={
                      texts.dashboardGuide.inviteActions[1].ContinueVariant
                    }
                    key={texts.dashboardGuide.inviteActions[1].ContinueCaption}
                    onClick={navigateToInvite}
                  >
                    {texts.dashboardGuide.inviteActions[1].ContinueCaption}
                  </Button>
                </div>
              }
            />
          )}
        </div>
      </Modal>
    </div>
  ) : (
    <></>
  )
}

export default DashboardGuide
