import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import activeArrow from '../../components/upload/assets/activeArrow.svg'

const DocumentationNav = ({ setHighlight, navigation }) => {
  const [activeItem, setActiveItem] = useState(null)

  const router = useRouter()
  const headerHeight = 56

  const handleClick = (obj, item) => {
    router.push(`${obj.href}`)
    setActiveItem(item)
    setHighlight(+item)
    const element = document.getElementById(obj.href.replace('#', ''))
    if (element) {
      const rect = element.getBoundingClientRect()

      window.scrollTo({
        top: rect.top + window.scrollY - headerHeight,
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  return (
    <ul className={styles.sider}>
      {Object.keys(navigation.navItems).map((item) => (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events
        <li
          className={classNames.use(styles.siderItem, {
            [styles.activeItem]: activeItem === item,
          })}
          key={navigation.navItems[item].item}
          onClick={() => handleClick(navigation.navItems[item], item)}
        >
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className={styles.siderItemLink}>
            {navigation.navItems[item].item}
          </a>
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
