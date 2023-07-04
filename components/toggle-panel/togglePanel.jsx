import React, { useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import togglerArrow from 'components/upload/assets/togglerArrow.svg'

const TogglePanel = ({ className, title, content }) => {
  const [isOpen, setIsOpen] = useState(false)

  const contentRef = useRef(null)

  const togglePanel = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClick = (e) => {
    if (contentRef.current?.contains(e.target)) return

    setIsOpen((prev) => !prev)
  }

  return (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className={`toggle-panel ${className}`} onClick={togglePanel}>
      <div className={styles.togglePanelTitle}>
        {title}
        <div
          className={classNames.use(styles.svgWrapper, {
            [styles.rotate]: isOpen,
          })}
        >
          <img src={togglerArrow} alt="togglerArrow" />
        </div>
      </div>
      {isOpen && (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div onClick={handleClick} className={styles.toggleContent}>
          {content}
        </div>
      )}
    </div>
  )
}

export default TogglePanel
