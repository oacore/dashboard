import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import firstStep from '../upload/assets/stepFirst.svg'
import secondStep from '../upload/assets/stepTwo.svg'
import thirdStep from '../upload/assets/stepThree.svg'
import forthStep from '../upload/assets/stepFour.svg'
import OnboardingGuideContent from './dashboardGuideContent'
import useOnClickOutside from '../../utils/hooks/use-clickoutside'
import Markdown from '../markdown'

import * as texts from 'texts/depositing'

const DashboardGuide = ({ dataProviderData, modal, placement, tutorial }) => {
  const [shouldRender, setShouldRender] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    const t = localStorage.getItem('onboardingDone')
    if (t === null) setShouldRender(true)
  }, [shouldRender])

  const handleSkip = () => {
    localStorage.setItem('onboardingDone', 'true')
    tutorial.closeModal()
  }

  const renderNext = () => {
    if (tutorial.currentStep !== 4) tutorial.nextStep()
    else handleSkip()
  }

  useOnClickOutside(modalRef, renderNext)

  const navigateToPage = () => {
    window.location = `/data-providers/${dataProviderData.id}/repository?referrer=upload`
  }

  const navigateToMapping = () => {
    window.location = `/data-providers/${dataProviderData.id}/repository?referrer=mapping`
  }

  const navigateToInvite = () => {
    window.location = `/data-providers/${dataProviderData.id}/general?referrer=invite`
  }

  return shouldRender ? (
    <div ref={modal}>
      <Modal
        onClose={() => tutorial.closeModal()}
        hideManually
        aria-label="modal"
        className={classNames.use(styles.smallModal, {
          [styles.modal]: tutorial.currentStep === 1,
          [styles[placement]]: placement,
        })}
      >
        <div
          className={classNames.use({
            [styles.arrowNone]: tutorial.currentStep === 1,
            [styles.arrowBottom]: tutorial.currentStep === 2,
            [styles.arrow]: tutorial.currentStep === 3 || 4,
          })}
        />
        <div ref={modalRef}>
          {tutorial.currentStep === 1 && (
            <OnboardingGuideContent
              headerTitle={texts.dashboardGuide.mainTitle}
              page={1}
              from={4}
              hideLeftArrow
              onNext={() => tutorial.nextStep()}
              onPrev={() => tutorial.prevStep()}
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
                    onClick={() => tutorial.nextStep()}
                  >
                    {texts.dashboardGuide.actions[1].ContinueCaption}
                  </Button>
                </div>
              }
            />
          )}

          {tutorial.currentStep === 2 && (
            <OnboardingGuideContent
              customHeaderTitle={texts.dashboardGuide.uploadMainTitle}
              page={2}
              from={4}
              onNext={() => tutorial.nextStep()}
              onPrev={() => tutorial.prevStep()}
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

          {tutorial.currentStep === 3 && (
            <OnboardingGuideContent
              customHeaderTitle={texts.dashboardGuide.mappingMainTitle}
              page={3}
              from={4}
              onNext={() => tutorial.nextStep()}
              onPrev={() => tutorial.prevStep()}
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

          {tutorial.currentStep === 4 && (
            <OnboardingGuideContent
              customHeaderTitle={texts.dashboardGuide.inviteMainTitle}
              page={4}
              from={4}
              hideRightArrow
              onNext={() => tutorial.nextStep()}
              onPrev={() => tutorial.prevStep()}
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
