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

const Article = ({
  tag: Tag = 'td',
  className,
  article,
  changeVisibility,
  loading,
}) => {
  const [visibleMenu, setVisibleMenu] = React.useState(false)

  const handleToggleRedirect = (e, key, outputsId, oaiId) => {
    e.preventDefault()
    e.stopPropagation()
    setVisibleMenu(false)
    if (key === 'coreUrl')
      window.open(`https://core.ac.uk/outputs/${outputsId}`, '_blank')
    else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
  }

  const menuRef = useRef()

  const { article: text } = texts

  // Map exception for authors
  const fields = text.fields.map((item) => ({
    ...item,
    value: Array.isArray(article[item.key])
      ? article[item.key].map((author) => author[item.findBy]).join(' ')
      : article[item.key],
  }))

  const actions = text.actions.map((item) => ({
    ...item,
    value: article[item.key],
  }))

  const toggleVisibleMenu = () => {
    setVisibleMenu(!visibleMenu)
  }

  const closeMenu = () => {
    setVisibleMenu(false)
  }

  const visibility = text.visibility.find(
    (item) => item.disabled === article?.disabled
  )

  useOutsideClick(menuRef, closeMenu)

  return (
    <Tag
      colSpan="12"
      className={classNames.use(styles.article).join(className)}
    >
      <div className={styles.articleHeader}>
        <h2>{article.title}</h2>
        <div className={styles.actions} ref={menuRef}>
          <Popover placement="top" content={visibility.extraText}>
            <Button
              disabled={loading}
              className={classNames.use(styles.actionButton, {
                [styles.actionButtonDisabled]: visibility.disabled,
              })}
              onClick={() => changeVisibility(article)}
            >
              <Icon
                src={`#${visibility.icon}`}
                className={styles.actionButtonIcon}
              />
              {visibility.title}
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
            {actions.map(({ title, key }) => (
              <Menu.Item key={key} target="_blank">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                  onClick={(e) =>
                    handleToggleRedirect(e, key, article.id, article.oai)
                  }
                  className={styles.togglerTitle}
                >
                  {title}
                </div>
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
