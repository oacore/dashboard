import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './index.css'

const DropDownItem = React.memo(({ children }) => <li>{children}</li>)

const DropdownToggle = React.memo(
  ({
    isMenuVisible,
    toggleVisibility,
    className,
    children,
    tag: Tag = 'div',
    ...restProps
  }) => (
    <Tag
      className={classNames.use(styles.menuToggle, className)}
      tabindex="0"
      role="button"
      aria-expanded={isMenuVisible}
      onBlur={() => toggleVisibility(false)}
      onFocus={() => toggleVisibility(true)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const DropDownMenu = React.memo(
  ({ isVisible, children, className, tag: Tag = 'ul', ...restProps }) => (
    <Tag
      role="listbox"
      className={classNames
        .use(
          {
            menu: true,
            show: isVisible,
          },
          className
        )
        .from(styles)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const Dropdown = React.memo(
  ({ className, children, isRelative = true, tag: Tag = 'div' }) => {
    const [isMenuVisible, toggleVisibility] = useState(false)
    const childrenArray = React.Children.map(children, child => child)
    const toggle = childrenArray.find(e => e.type === DropdownToggle)
    const menu = childrenArray.find(e => e.type === DropDownMenu)
    if (childrenArray.length !== 2) {
      throw Error(
        'Dropdown component expects exact 2 children. Dropdown.Toggle & Dropdown.Menu.'
      )
    }
    if (toggle === undefined)
      throw Error('Dropdown Components expects Dropdown.Toggle as a children.')

    if (menu === undefined)
      throw Error('Dropdown Components expects Dropdown.Menu as a children.')

    return (
      <Tag
        className={classNames
          .use(
            {
              'menu-container-relative': isRelative,
            },
            className
          )
          .from(styles)}
      >
        {React.cloneElement(toggle, { isMenuVisible, toggleVisibility })}
        {isMenuVisible &&
          React.cloneElement(menu, { isVisible: isMenuVisible })}
      </Tag>
    )
  }
)

Dropdown.Toggle = DropdownToggle
Dropdown.Menu = DropDownMenu
Dropdown.Item = DropDownItem

export default Dropdown
