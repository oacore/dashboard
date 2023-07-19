import React, { useRef, useState } from 'react'

import styles from './styles.module.css'

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
      {title}
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
