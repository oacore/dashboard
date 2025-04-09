import { Button } from '@oacore/design/lib/elements'
import React, { useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import accept from '../upload/assets/acceptLight.svg'
import deny from '../upload/assets/denyLight.svg'
import redirect from '../upload/assets/urlRedirect.svg'
import { ProgressSpinner } from '../../design'

const StatusCard = ({
  onClose,
  handleStatusUpdate,
  statusSentence,
  loadingStatus,
  href,
  rrs,
  articleId,
  texts,
}) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.modalWrapper}`)) onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      className={classNames.use(styles.modalWrapper, {
        [styles.modalWrapperRrs]: rrs,
      })}
    >
      <div className={styles.spinTitleWrapper}>
        <h3 className={styles.modalTitle}>{texts.statusModal.title}</h3>
        {loadingStatus && (
          <div className={styles.spinnerWrapper}>
            <ProgressSpinner className={styles.spinnerSmall} />
          </div>
        )}
      </div>
      <div className={styles.confirmationPopup}>{statusSentence}</div>
      <div className={styles.redirect}>
        <a
          className={styles.redirectBtn}
          target="_blank"
          href={href}
          rel="noreferrer"
        >
          <span>{texts.statusModal.link}</span>
          <img src={redirect} alt="" />
        </a>
      </div>
      <div className={styles.modalFooter}>
        {Object.values(texts.statusActions).map(({ button, key }) => (
          <Button
            onClick={(e) => handleStatusUpdate(e, articleId, key)}
            className={classNames.use(styles.modalFooterY, {
              [styles.modalFooterN]: button === 'WRONG',
            })}
          >
            {button}
            {button === 'WRONG' ? (
              <img src={deny} alt="" />
            ) : (
              <img src={accept} alt="" />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default StatusCard
