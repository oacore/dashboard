import React, { useRef, useState, useEffect } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

import { generateId, KEYS } from 'utils/helpers'

const DropDownItem = React.memo(
  ({
    toggleVisibility,
    isActive,
    children,
    onSelection,
    tag: Tag = 'button',
    ...passProps
  }) => (
    <li
      className={classNames.use(isActive && styles.menuItemActive)}
      role="menuitem"
      tabIndex="-1"
    >
      <Tag
        onMouseDown={(e) => {
          // prevent to lose focus and rerendering element
          // https://github.com/facebook/react/issues/4210
          e.preventDefault()
        }}
        onClick={() => {
          onSelection()
          toggleVisibility(false)
        }}
        {...passProps}
      >
        {children}
      </Tag>
    </li>
  )
)

const DropdownToggle = React.forwardRef(
  (
    {
      isMenuVisible,
      toggleVisibility,
      className,
      children,
      tag: Tag = 'div',
      ...restProps
    },
    ref
  ) => (
    <Tag
      ref={ref}
      className={classNames.use(styles.menuToggle, className)}
      tabindex="0"
      role="button"
      aria-expanded={isMenuVisible}
      aria-haspopup="true"
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const DropDownMenu = React.memo(
  React.forwardRef(
    (
      {
        activeMenuItem,
        setTotalMenuItems,
        isVisible,
        toggleVisibility,
        children,
        className,
        tag: Tag = 'ul',
        ...restProps
      },
      ref
    ) => {
      const childrenArray = React.Children.map(children, (child) => child)
      if (childrenArray.some((e) => e.type !== DropDownItem))
        throw Error('Dropdown menu expects only children of type. DropDownItem')

      useEffect(() => setTotalMenuItems(childrenArray.length), [
        childrenArray.length,
      ])

      return (
        <Tag
          ref={ref}
          role="menu"
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
          {childrenArray.map((e, index) =>
            React.cloneElement(e, {
              isActive: index === activeMenuItem,
              toggleVisibility,
            })
          )}
        </Tag>
      )
    }
  )
)

const Dropdown = React.memo(
  ({
    className,
    children,
    isRelative = true,
    tag: Tag = 'div',
    id = generateId(),
  }) => {
    const toggleRef = useRef(null)
    const menuRef = useRef(null)
    const [isMenuVisible, toggleVisibility] = useState(false)
    const [activeMenuItem, setActiveMenuItem] = useState(0)
    const [totalMenuItems, setTotalMenuItems] = useState(0)
    const childrenArray = React.Children.map(children, (child) => child)
    const toggle = childrenArray.find((e) => e.type === DropdownToggle)
    const menu = childrenArray.find((e) => e.type === DropDownMenu)
    if (childrenArray.length !== 2) {
      throw Error(
        'Dropdown component expects exact 2 children. Dropdown.Toggle & Dropdown.Menu.'
      )
    }
    if (toggle === undefined)
      throw Error('Dropdown Components expects Dropdown.Toggle as a children.')

    if (menu === undefined)
      throw Error('Dropdown Components expects Dropdown.Menu as a children.')

    useEffect(() => {
      if (menuRef.current) menuRef.current.childNodes[activeMenuItem].focus()
    }, [menuRef])

    const handleKeyDown = (event) => {
      let direction = 1
      let pos = activeMenuItem || totalMenuItems

      switch (event.which) {
        case KEYS.ENTER:
          menuRef.current.childNodes[activeMenuItem].childNodes[0].click()
          break

        case KEYS.ESC:
          toggleRef.current.blur()
          toggleVisibility(false)
          break

        case KEYS.UP:
        case KEYS.DOWN:
          event.preventDefault()
          event.stopPropagation()
          if (totalMenuItems === 0) return

          direction = event.which - KEYS.DOWN + 1 // either -1 or 1
          pos = (pos + direction) % totalMenuItems
          setActiveMenuItem(pos)
          menuRef.current.childNodes[pos].focus()
          break
        default:
      }
    }

    return (
      <Tag
        id={`dropdown-menu-${id}`}
        className={classNames
          .use(
            {
              'menu-container-relative': isRelative,
            },
            className
          )
          .from(styles)}
        onKeyDown={handleKeyDown}
        onBlur={() => toggleVisibility(false)}
        onFocus={() => toggleVisibility(true)}
      >
        {React.cloneElement(toggle, {
          'ref': toggleRef,
          isMenuVisible,
          toggleVisibility,
          'aria-controls': `dropdown-menu-list-${id}`,
        })}
        {React.cloneElement(menu, {
          activeMenuItem,
          setTotalMenuItems,
          toggleVisibility,
          ref: menuRef,
          isVisible: isMenuVisible,
          id: `dropdown-menu-list-${id}`,
        })}
      </Tag>
    )
  }
)

Dropdown.Toggle = DropdownToggle
Dropdown.Menu = DropDownMenu
Dropdown.Item = DropDownItem

export default Dropdown
