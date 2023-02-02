import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import textData from '../../texts/memership'
import styles from './styles.module.css'
import activeArrow from '../../components/upload/assets/activeArrow.svg'

const DocumentationNav = () => {
  const [activeItem, setActiveItem] = useState(null)

  const handleClick = (obj, item) => {
    setActiveItem(item)
    const element = document.getElementById(obj.href.replace('#', ''))
    if (element) {
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      element.firstChild.classList.add(styles.highlight)
    }
  }

  return (
    <ul className={styles.sider}>
      {Object.keys(textData.navItems).map((item) => (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
        <li
          className={classNames.use(styles.siderItem, {
            [styles.activeItem]: activeItem === item,
          })}
          key={textData.navItems[item].item}
          onClick={() => handleClick(textData.navItems[item], item)}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className={styles.siderItemLink}>{textData.navItems[item].item}</a>
          {activeItem === item ? (
            <img src={activeArrow} alt="Logo" className={styles.logo} />
          ) : (
            ''
          )}
        </li>
      ))}
    </ul>
  )
}

export default DocumentationNav
