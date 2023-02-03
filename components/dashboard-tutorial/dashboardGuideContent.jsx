import React from 'react'
import { Button } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import ArrowLeft from '../upload/assets/ArrowLeft.svg'
import Arrow from '../upload/assets/ArrowRight.svg'
import styles from './styles.module.css'

const OnboardingGuideContent = ({
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
  <div className={styles.contentWrapper}>
    <div className={styles.withNextModalHeader}>
      <div
        className={classNames.use(styles.withNextModalHeaderTitle, {
          [styles.smallTitle]: customHeaderTitle,
        })}
      >
        {headerTitle || customHeaderTitle}
      </div>

      <div className={styles.nextButtonWrap}>
        {!hideLeftArrow && (
          <Button className={styles.arrowButton} onClick={onPrev}>
            <img alt="tooltip-arrow" src={ArrowLeft} />
          </Button>
        )}
        <div className={styles.pageCounterWrapper}>
          {page}
          <span className={styles.separator}>of</span>
          {from}
        </div>
        {!hideRightArrow && (
          <Button className={styles.arrowButton} onClick={onNext}>
            <img alt="tooltip-arrow" src={Arrow} />
          </Button>
        )}
      </div>
    </div>
    <div>
      <div>{content}</div>
    </div>
    <div>{customFooter}</div>
  </div>
)

export default OnboardingGuideContent
