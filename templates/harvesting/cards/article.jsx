import React, { useRef } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button, Icon } from '@oacore/design/lib/elements'
import { Popover } from '@oacore/design/lib/modules'
import { useOutsideClick } from '@oacore/design/lib/hooks'

import styles from './table.module.css'

import Menu from 'components/menu'
import { capitalize } from 'utils/helpers'
import texts from 'texts/issues'
import ReadMore from 'components/read-more'

const Article = ({ tag: Tag = 'td', className, article }) => {
  const [visibleMenu, setVisibleMenu] = React.useState(false)

  const menuRef = useRef()

  const fields = texts.article.fields.map((item) => ({
    ...item,
    value: Array.isArray(article[item.key])
      ? article[item.key].join(' ')
      : article[item.key],
  }))

  const actions = texts.article.actions.map((item) => ({
    ...item,
    value: article[item.key],
  }))

  const toggleVisibleMenu = () => {
    setVisibleMenu(!visibleMenu)
  }

  const closeMenu = () => {
    setVisibleMenu(false)
  }

  useOutsideClick(menuRef, closeMenu)

  return (
    <Tag
      colSpan="12"
      className={classNames.use(styles.article).join(className)}
    >
      <div className={styles.articleHeader}>
        <h2>{article.title}</h2>
        <div className={styles.actions} ref={menuRef}>
          <Popover placement="top" content="Click to disable">
            <Button className={styles.actionButton}>
              <Icon src="#eye" className={styles.actionButtonIcon} />
              Live in core
            </Button>
          </Popover>
          <Button
            className={styles.actionButtonPure}
            onClick={toggleVisibleMenu}
            ref={menuRef}
          >
            <Icon src="#dots-vertical" />
          </Button>
          <Menu visible={visibleMenu} className={styles.menu}>
            {actions.map(({ title, value, key }) => (
              <Menu.Item key={key} target="_blank" href={value}>
                {title}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
      <div className={styles.wrapper}>
        {fields.map(
          ({ name, value, key }) =>
            value && (
              <div className={styles.box} key={key}>
                <p className={styles.boxProp}>{name}</p>
                <ReadMore
                  className={classNames.use(
                    styles.boxCaption,
                    `${styles[`boxCaption${capitalize(key)}`]}`
                  )}
                >
                  {value}
                </ReadMore>
              </div>
            )
        )}
      </div>
    </Tag>
  )
}

export default Article
