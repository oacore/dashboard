import React, { useEffect, useState } from 'react'
import { Button, Icon } from '@oacore/design/lib/elements'
import { observer } from 'mobx-react-lite'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import Actions from '../../../components/actions'
import Table from '../../../components/table'
import Menu from '../../../components/menu'
import texts from '../../../texts/deduplication/deduplication.yml'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import ExportButton from '../../../components/export-button'
import AccessPlaceholder from '../../../components/access-placeholder/AccessPlaceholder'

const DeduplicationListTable = observer(
  ({
    handeAdditionalInfo,
    list,
    duplicatesUrl,
    checkBillingType,
    dataProviderData,
  }) => {
    const [page, setPage] = useState(0)
    const [records, setRecords] = useState([])
    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null)
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])

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
      else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
    }

    useEffect(() => {
      if (checkBillingType) setRecords(list.slice(0, 5))
      else {
        const newRecords = [
          ...records,
          ...list.slice(page * 10, (page + 1) * 10),
        ]
        setRecords(newRecords)
      }
    }, [page, list, checkBillingType])

    const searchChange = (event) => {
      setLocalSearchTerm(event.target.value)
    }

    useEffect(() => {
      const lowerSearchTerm = localSearchTerm.toLowerCase()
      if (lowerSearchTerm) {
        const filteredData = list.filter(
          (record) =>
            record.oai.toLowerCase().includes(lowerSearchTerm) ||
            record.title.toLowerCase().includes(lowerSearchTerm) ||
            record.authors.some((author) =>
              author.toLowerCase().includes(lowerSearchTerm)
            )
        )
        setSearchResults(filteredData)
      } else setSearchResults(records)
    }, [localSearchTerm, records, list])

    return (
      <>
        <div className={styles.mainHeaderWrapper}>
          <Card.Title tag="h2">
            List of potential duplicates and alternative versions
          </Card.Title>
          {checkBillingType ? (
            <Actions description={texts.info.listOfDuplicates} />
          ) : (
            <Actions
              downloadUrl={duplicatesUrl}
              description={texts.info.listOfDuplicates}
            />
          )}
        </div>
        <Table
          rowClick={(row) => handeAdditionalInfo(row)}
          rowActionProp
          className={styles.issueTable}
          searchable={!checkBillingType}
          localSearch
          searchChange={searchChange}
          localSearchTerm={localSearchTerm}
          fetchData={() => setPage(page + 1)}
          data={searchResults}
          totalLength={list.length}
          size={searchResults.length}
          isHeaderClickable
          excludeFooter={checkBillingType}
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
              (
                <span
                  className={styles.duplicateCell}
                >{`+ ${v.count} found`}</span>
              ) || '-'
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
                    <Menu.Item key={key} target="_blank">
                      {/* eslint-disable-next-line max-len */}
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                      <div
                        onClick={(e) =>
                          handleToggleRedirect(e, key, v.documentId, v.oai)
                        }
                        className={styles.togglerTitle}
                      >
                        {title}
                      </div>
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            )}
          />
          <Table.Action>
            <ExportButton href={duplicatesUrl}>download csv</ExportButton>
          </Table.Action>
        </Table>
        {checkBillingType && (
          <AccessPlaceholder
            dataProviderData={dataProviderData}
            customWidth
            description="To see and download the full list of potential duplicates and alternative versions become our  Supporting or Sustaining member"
          />
        )}
      </>
    )
  }
)

export default DeduplicationListTable
