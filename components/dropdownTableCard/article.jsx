import React, { useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button, Icon } from '@oacore/design/lib/elements'
import { Popover } from '@oacore/design/lib/modules'
import { useOutsideClick } from '@oacore/design/lib/hooks'

import styles from './styles.module.css'
import { ProgressSpinner } from '../../design'

import Menu from 'components/menu'
import { capitalize } from 'utils/helpers'
import texts from 'texts/rrs-retention'
import ReadMore from 'components/read-more'

const TableArticle = ({
  tag: Tag = 'td',
  className,
  article,
  outputsUrl,
  loading,
  changeVisibility,
  articleAdditionalDataLoading,
  removeLiveActions,
  renderSdgIcons,
}) => {
  const [visibleMenu, setVisibleMenu] = useState(false)

  const menuRef = useRef()

  const { article: text } = texts

  // Map exception for authors and sdg
  const fields = text.fields.map((item) => {
    let value = article[item.key]
    if (Array.isArray(value)) {
      if (item.key === 'authors')
        value = value.map((author) => author[item.findBy]).join(' ')
      else if (item.key === 'sdg') {
        value = value.map((sdgItem) => (
          <div className={styles.sdgScoreWrapper}>
            {renderSdgIcons(sdgItem.type, sdgItem.score)}
            <span className={styles.sdgScore}>{sdgItem.score}</span>
          </div>
        ))
      }
    }
    return {
      ...item,
      value,
    }
  })

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
      {articleAdditionalDataLoading ? (
        <div className={styles.spinnerWrapper}>
          <ProgressSpinner className={styles.spinner} />
        </div>
      ) : (
        <>
          <div className={styles.articleHeader}>
            <h2>{article.title}</h2>
            {removeLiveActions ? (
              <div
                className={classNames.use(styles.actions, {
                  [styles.gap]: removeLiveActions,
                })}
              >
                <Button variant="outlined" target="_blank" href={outputsUrl}>
                  Open in CORE
                </Button>
                <Button
                  variant="outlined"
                  target="_blank"
                  href={`${process.env.IDP_URL}/oai/${article.oai}`}
                >
                  Open in the Repository
                </Button>
              </div>
            ) : (
              <div className={styles.actions} ref={menuRef}>
                <Popover placement="top" content={visibility?.extraText}>
                  <Button
                    disabled={loading}
                    className={classNames.use(styles.actionButton, {
                      [styles.actionButtonDisabled]: visibility?.disabled,
                    })}
                    onClick={() => changeVisibility(article)}
                  >
                    <Icon
                      src={`#${visibility?.icon}`}
                      className={styles.actionButtonIcon}
                    />
                    {visibility?.title}
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
                  {actions.map(({ title, key, generatedUrl }) => (
                    <Menu.Item
                      key={key}
                      target="_blank"
                      href={
                        generatedUrl
                          ? outputsUrl
                          : `${process.env.IDP_URL}/oai/${article.oai}`
                      }
                    >
                      {title}
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            )}
          </div>
          <div className={styles.wrapper}>
            {fields.map(
              ({ name, value, key }) =>
                value && (
                  <div className={styles.box} key={key}>
                    <p className={styles.boxProp}>{name}</p>
                    <ReadMore
                      className={classNames.use(
                        name === 'SDG' && styles.sdgWrapper,
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
        </>
      )}
    </Tag>
  )
}

export default TableArticle
