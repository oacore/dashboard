import React, { useEffect, useState } from 'react'
import { Icon } from '@oacore/design/lib/elements'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import { ProgressSpinner, Card } from '../../../design'
import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import Table from '../../../components/table'
import texts from '../../../texts/deduplication/deduplication.yml'
import ExportButton from '../../../components/export-button'
import AccessPlaceholder from '../../../components/access-placeholder/AccessPlaceholder'
import DashboardTipMessage from '../../../components/dashboard-tip-message'
import Tablev2 from '../../../components/tablev2/tablev2'

const DeduplicationListTable = observer(
  ({
    handeAdditionalInfo,
    list,
    duplicateData,
    duplicatesUrl,
    checkBillingType,
    dataProviderData,
    duplicateDataLoading,
  }) => {
    const [page, setPage] = useState(0)
    const [records, setRecords] = useState([])
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [visibleHelp, setVisibleHelp] = useState(
      localStorage.getItem('visibleHelp') === 'true'
    )

    useEffect(() => {
      if (checkBillingType) setRecords(list.slice(0, 5))
      else {
        const startIndex = page * 10
        const endIndex = Math.min(startIndex + 10, list.length)
        const newRecords = [...records, ...list.slice(startIndex, endIndex)]
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

    const fetchData = () => {
      setPage(page + 1)
    }

    return (
      <>
        <div className={styles.mainHeaderWrapper}>
          <Card.Title tag="h2">
            List of potential duplicates and alternative versions
          </Card.Title>
          {checkBillingType ? (
            <Actions
              description={texts.info.listOfDuplicates}
              hoverIcon={
                <Icon
                  src="#alert-circle-outline"
                  style={{ color: '#757575' }}
                />
              }
            />
          ) : (
            <Actions
              downloadUrl={duplicatesUrl}
              description={texts.info.listOfDuplicates}
              hoverIcon={
                <Icon
                  src="#alert-circle-outline"
                  style={{ color: '#757575' }}
                />
              }
            />
          )}
        </div>
        <div className={styles.itemCountIndicator}>
          We have found{' '}
          <span className={styles.itemCount}>{duplicateData.count}</span> items.
          Review and download them below.
        </div>
        <DashboardTipMessage
          show={texts.helpInfo.show}
          hide={texts.helpInfo.hide}
          description={texts.helpInfo.description}
          setText={setVisibleHelp}
          activeText={visibleHelp}
        />
        {duplicateDataLoading ? (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        ) : (
          <Tablev2
            rowClick={(row) => handeAdditionalInfo(row)}
            className={styles.issueTable}
            data={searchResults}
            size={searchResults?.length}
            totalLength={list.length}
            searchable
            localSearch
            localSearchTerm={localSearchTerm}
            searchChange={searchChange}
            fetchData={fetchData}
            rowActionProp
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
              display="Matches"
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
              id="status"
              display="Status"
              getter={(v) => {
                const types = v.duplicates.map((item) => item.type)
                const hasUndefined = types.some((type) => type === undefined)
                if (hasUndefined)
                  return <div className={styles.toReview}>To review</div>
                return <div className={styles.reviewed}>Reviewed</div>
              }}
              className={styles.duplicateColumn}
            />
            <Table.Column
              id="version"
              display="Version"
              getter={(v) => (
                <div className={styles.cellWrapper}>
                  {v.duplicates.map((item, index) => (
                    <div
                      /* eslint-disable-next-line react/no-array-index-key */
                      key={index}
                      className={classNames.use(styles.cell, {
                        [styles.dash]:
                          item.type === 'notSameArticle' ||
                          item.type === 'duplicate',
                        [styles.typeCell]: item.type,
                      })}
                    >
                      {item.type === 'notSameArticle' ||
                      item.type === 'duplicate'
                        ? '-'
                        : item.type || '-'}
                    </div>
                  ))}
                </div>
              )}
            />
            <Table.Action>
              <ExportButton href={duplicatesUrl}>download csv</ExportButton>
            </Table.Action>
          </Tablev2>
        )}
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
