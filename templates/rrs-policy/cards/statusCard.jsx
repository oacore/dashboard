import { Button } from '@oacore/design/lib/elements'
import React, { useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import texts from '../../../texts/rrs-retention/rrs.yml'
import accept from '../../../components/upload/assets/acceptLight.svg'
import deny from '../../../components/upload/assets/denyLight.svg'
import redirect from '../../../components/upload/assets/urlRedirect.svg'

const StatusCard = ({ onClose, handleStatusUpdate, v }) => {
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
    <div className={styles.modalWrapper}>
      <h3 className={styles.modalTitle}>{texts.statusModal.title}</h3>
      <div className={styles.confirmationPopup}>
        {texts.statusModal.description}
      </div>
      <div className={styles.redirect}>
        <span>{texts.statusModal.link}</span>
        <img src={redirect} alt="" />
      </div>
      <div className={styles.modalFooter}>
        {Object.values(texts.statusActions).map(({ button, key }) => (
          <Button
            onClick={(e) => handleStatusUpdate(e, v.articleId, key)}
            // className={styles.modalFooterN}
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
