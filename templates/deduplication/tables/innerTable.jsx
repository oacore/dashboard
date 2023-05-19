import React, { useState } from 'react'
import { Button, Icon } from '@oacore/design/lib/elements'
import { observer } from 'mobx-react-lite'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import info from '../../../components/upload/assets/info.svg'
import Markdown from '../../../components/markdown'
import texts from '../../../texts/deduplication/deduplication.yml'
import Table from '../../../components/table'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'

const InnerTable = observer(({ combinedArray }) => {
  const [visibleMenu, setVisibleMenu] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState(null)

  const handleClick = (e, rowDetail) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedRowData(rowDetail)
    setVisibleMenu(!visibleMenu)
  }

  const handleRedirect = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://core.ac.uk/outputs/${id}`, '_blank')
  }

  const handleToggleRedirect = (e, key, outputsId, oaiId) => {
    e.preventDefault()
    e.stopPropagation()
    setVisibleMenu(false)
    if (key === 'coreUrl')
      window.open(`https://core.ac.uk/outputs/${outputsId}`, '_blank')
    else window.open(`https://api.core.ac.uk/oai/${oaiId}`, '_blank')
  }

  return (
    <>
      <Message className={styles.dataErrorWrapper}>
        <img className={styles.infoIcon} src={info} alt="description" />
        <Markdown className={styles.infoText}>
          {texts.moreInfo.description}
        </Markdown>
      </Message>
      <div>
        <Table
          className={styles.issueTable}
          fetchData={() => {}}
          hidePagination
          data={combinedArray}
          isHeaderClickable
        >
          <Table.Column
            id="oai"
            display="OAI"
            getter={(v) => {
              if (v?.oai) {
                return (
                  <span className={styles.oaiCell}>
                    {v.oai.split(':').pop()}
                  </span>
                )
              }
              return '-'
            }}
            className={styles.oaiColumn}
          />
          <Table.Column
            id="title"
            display="Title"
            getter={(v) => v?.title || '-'}
            className={styles.titleColumn}
          />
          <Table.Column
            id="authors"
            display="Authors"
            className={styles.authorsColumn}
            getter={(v) => v?.authors.map((author) => author).join(' ')}
          />
          <Table.Column
            id="count"
            display="Duplicates"
            getter={(v) =>
              <span className={styles.duplicateCellInner}>{v?.type}</span> ||
              '-'
            }
            className={styles.duplicateColumn}
          />
          <Table.Column
            id="publicationDate"
            display="Publication date"
            className={styles.publicationDateColumn}
            getter={(v) => v?.publicationDate}
          />
          <Table.Column
            id="visibility"
            getter={(v) => (
              <Icon
                src="#eye"
                onClick={(e) => handleRedirect(e, v.documentId)}
                className={styles.visibilityIcon}
              />
            )}
            className={styles.visibilityStatusColumn}
          />
          <Table.Column
            id="output"
            getter={(v) => (
              <div className={styles.actionButtonWrapper}>
                <Button
                  className={styles.actionButtonPure}
                  onClick={(e) => handleClick(e, v)}
                >
                  <img src={kababMenu} alt="kababMenu" />
                </Button>
                <Menu
                  visible={visibleMenu && selectedRowData === v}
                  className={styles.menuButton}
                  stopPropagation
                >
                  {Object.values(texts.actions).map(({ title, key }) => (
                    <Menu.Item key={key}>
                      {/* eslint-disable-next-line max-len */}
                      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                      <div
                        onClick={(e) =>
                          handleToggleRedirect(e, key, v.documentId, v.oai)
                        }
                      >
                        {title}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            )}
          />
        </Table>
      </div>
    </>
  )
})

export default InnerTable
