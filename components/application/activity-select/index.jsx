import path from 'path'

import React, { useState } from 'react'
import Link from 'next/link'
import { classNames } from '@oacore/design/lib/utils'
import { useRouter } from 'next/router'

import activities from '../activities'
import styles from './styles.module.css'
import navArrow from '../../upload/assets/navArrow.svg'

import { Icon, Drawer } from 'design'
import { navigation } from 'texts'

const toIcon = (value) => `#${activities.get(value).icon}`

const ActivitySelect = ({ children }) => (
  <Drawer.List className={styles.list}>{children}</Drawer.List>
)

const ActivitySelectOption = ({
  children,
  value,
  selected,
  subMenu,
  dataProviderId,
  showSubMenu,
  setShowSubMenu,
}) => {
  const [selectedSubMenu, setSelectedSubMenu] = useState(null)
  const router = useRouter()

  const handleSubMenu = () => {
    setShowSubMenu(!showSubMenu)
  }

  const handleSubMenuClick = (item) => {
    setSelectedSubMenu(item.id)
  }

  return subMenu ? (
    <div>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleSubMenu}>
        <div
          className={styles.settingsMenuItem}
          title={navigation.tooltips[value]}
        >
          <div className={styles.settingItemWrapper}>
            {children || (
              <div className={styles.menuItem}>
                <div>
                  <Icon
                    className={styles.itemIcon}
                    src={toIcon(value)}
                    alt=""
                    aria-hidden
                  />
                  {navigation.items[value]}
                </div>
                <img
                  className={classNames.use(styles.arrowRight, {
                    [styles.arrowDown]: showSubMenu,
                  })}
                  src={navArrow}
                  alt="navArrow"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {showSubMenu && (
        <div className={styles.subMenuItems}>
          {subMenu?.map((item) => (
            <Link
              href={path.join('/data-providers/[data-provider-id]', item.id)}
              as={path.join('/data-providers', String(dataProviderId), item.id)}
              passHref
            >
              {/* eslint-disable-next-line max-len */}
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <div
                className={classNames.use(styles.subItem, {
                  [styles.subItemActive]: selectedSubMenu === item.id,
                  [styles.itemNon]: !router.route.includes(item.id),
                })}
                onClick={() => handleSubMenuClick(item)}
              >
                {item.value}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div>
      <Link
        href={path.join('/data-providers/[data-provider-id]', value)}
        as={path.join('/data-providers', String(dataProviderId), value)}
        passHref
      >
        <Drawer.Item
          className={styles[value]}
          active={selected}
          title={navigation.tooltips[value]}
        >
          <div className={styles.itemWrapper}>
            {children || (
              <>
                <Icon
                  className={styles.itemIcon}
                  src={toIcon(value)}
                  alt=""
                  aria-hidden
                />
                {navigation.items[value]}
              </>
            )}
          </div>
        </Drawer.Item>
      </Link>
    </div>
  )
}

ActivitySelect.Option = ActivitySelectOption

export default ActivitySelect
export { ActivitySelectOption as Option }
