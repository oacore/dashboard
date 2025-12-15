import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Button, Modal } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import firstStep from '../upload/assets/stepFirst.svg'
import secondStep from '../upload/assets/stepTwo.svg'
import thirdStep from '../upload/assets/stepThree.svg'
import forthStep from '../upload/assets/stepFour.svg'
import OnboardingGuideContent from './dashboardGuideContent'
import useOnClickOutside from '../../utils/hooks/use-clickoutside'
import Markdown from '../markdown'

import * as texts from 'texts/depositing'

const DashboardGuide = observer(
  ({ dataProviderData, modal, tutorial, targetRef }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [arrowTop, setArrowTop] = useState(null)
    const [positionReady, setPositionReady] = useState(false)
    const modalRef = useRef(null)

    // Step configurations for steps 2-4
    const stepsConfig = useMemo(
      () => ({
        2: {
          title: texts.dashboardGuide.uploadMainTitle,
          image: secondStep,
          text: texts.dashboardGuide.uploadText,
          actions: texts.dashboardGuide.uploadActions,
          onContinue: () => {
            window.location = `/data-providers/${dataProviderData.id}/repository?referrer=upload`
          },
        },
        3: {
          title: texts.dashboardGuide.mappingMainTitle,
          image: thirdStep,
          text: texts.dashboardGuide.mappingText,
          actions: texts.dashboardGuide.mappingActions,
          onContinue: () => {
            window.location = `/data-providers/${dataProviderData.id}/repository?referrer=mapping`
          },
        },
        4: {
          title: texts.dashboardGuide.inviteMainTitle,
          image: forthStep,
          text: texts.dashboardGuide.inviteText,
          actions: texts.dashboardGuide.inviteActions,
          onContinue: () => {
            window.location = `/data-providers/${dataProviderData.id}/organisational?referrer=invite`
          },
        },
      }),
      [dataProviderData.id]
    )

    const calculatePosition = useCallback(() => {
      if (!targetRef?.current) return

      const targetRect = targetRef.current.getBoundingClientRect()
      const sidebarWidth = 224
      const modalWidth = 320
      const modalHeight = 350
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      const updatePosition = (rect) => {
        const targetCenterY = rect.top + rect.height / 2
        let topPosition = targetCenterY - modalHeight / 2

        if (topPosition < 10) topPosition = 10
        if (topPosition + modalHeight > viewportHeight - 10)
          topPosition = viewportHeight - modalHeight - 10

        const arrowPosition = targetCenterY - topPosition

        setPosition({
          top: topPosition,
          left: Math.min(sidebarWidth + 20, viewportWidth - modalWidth - 20),
        })
        setArrowTop(arrowPosition)
        setPositionReady(true)
      }

      if (tutorial.currentStep === 2) updatePosition(targetRect)
      else if (tutorial.currentStep === 3 || tutorial.currentStep === 4) {
        setPositionReady(false)
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        setTimeout(() => {
          const updatedRect = targetRef.current.getBoundingClientRect()
          updatePosition(updatedRect)
        }, 400)
      }
    }, [targetRef, tutorial.currentStep])

    useEffect(() => {
      if (tutorial?.isModalOpen && tutorial.currentStep !== 1) {
        setPositionReady(false)
        calculatePosition()
        window.addEventListener('resize', calculatePosition)
        return () => window.removeEventListener('resize', calculatePosition)
      }
      return undefined
    }, [tutorial?.isModalOpen, tutorial.currentStep, calculatePosition])

    const handleSkip = () => {
      localStorage.setItem('onboardingDone', 'true')
      tutorial.closeModal()
    }

    const renderNext = () => {
      if (tutorial.currentStep !== 4) tutorial.nextStep()
      else handleSkip()
    }

    useOnClickOutside(modalRef, renderNext)

    const getModalStyle = () => {
      if (tutorial.currentStep === 1) return {}
      return {
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'none',
        opacity: positionReady ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      }
    }

    const getArrowStyle = () => {
      if (arrowTop === null || tutorial.currentStep === 1) return {}
      return {
        top: `${arrowTop}px`,
        transform: 'translateY(-50%)',
      }
    }

    const renderSmallStep = (step) => {
      const config = stepsConfig[step]
      if (!config) return null

      return (
        <OnboardingGuideContent
          customHeaderTitle={config.title}
          page={step}
          from={4}
          hideRightArrow={step === 4}
          onNext={() => tutorial.nextStep()}
          onPrev={() => tutorial.prevStep()}
          content={
            <div className={styles.smallModalWrapper}>
              <div className={styles.modalImageWrapper}>
                <img src={config.image} alt="" />
              </div>
              <div className={styles.modalBodyWrapper}>
                <div className={styles.smallUploadText}>{config.text}</div>
              </div>
            </div>
          }
          customFooter={
            <div className={styles.smallButtonGroup}>
              <Button
                variant={config.actions[0].skipVariant}
                onClick={handleSkip}
              >
                {config.actions[0].skipCaption}
              </Button>
              <Button
                variant={config.actions[1].ContinueVariant}
                onClick={config.onContinue}
              >
                {config.actions[1].ContinueCaption}
              </Button>
            </div>
          }
        />
      )
    }

    if (!tutorial?.isModalOpen) return null

    return (
      <div ref={modal}>
        <Modal
          onClose={() => tutorial.closeModal()}
          hideManually
          aria-label="modal"
          className={classNames.use({
            [styles.modal]: tutorial.currentStep === 1,
            [styles.smallModal]: tutorial.currentStep !== 1,
            [styles.positioned]: tutorial.currentStep !== 1,
          })}
          style={getModalStyle()}
        >
          <div
            className={classNames.use({
              [styles.arrowNone]: tutorial.currentStep === 1,
              [styles.arrow]: tutorial.currentStep !== 1,
            })}
            style={getArrowStyle()}
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
                              (service, index) => (
                                // eslint-disable-next-line max-len
                                // eslint-disable-next-line react/no-array-index-key
                                <li key={index}>{service?.title}</li>
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
                      onClick={handleSkip}
                    >
                      {texts.dashboardGuide.actions[0].skipCaption}
                    </Button>
                    <Button
                      variant={texts.dashboardGuide.actions[1].ContinueVariant}
                      onClick={() => tutorial.nextStep()}
                    >
                      {texts.dashboardGuide.actions[1].ContinueCaption}
                    </Button>
                  </div>
                }
              />
            )}

            {[2, 3, 4].includes(tutorial.currentStep) &&
              renderSmallStep(tutorial.currentStep)}
          </div>
        </Modal>
      </div>
    )
  }
)

export default DashboardGuide
