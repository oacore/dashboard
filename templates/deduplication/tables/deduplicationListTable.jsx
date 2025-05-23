import React, { useContext, useEffect, useState } from 'react'
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
import DashboardCachedMessage from '../../../components/dashboard-cached-message'
import { GlobalContext } from '../../../store'
import infoAction from '../../../components/upload/assets/infoAction.svg'

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
    const { ...globalStore } = useContext(GlobalContext)
    const [page, setPage] = useState(0)
    const [records, setRecords] = useState([])
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [visibleHelp, setVisibleHelp] = useState(
      localStorage.getItem('visibleHelp') === 'true'
    )
    const [sortDirection, setSortDirection] = useState('asc')
    const [sortStatusDirection, setSortStatusDirection] = useState('asc')

    useEffect(() => {
      if (checkBillingType) setRecords(list.slice(0, 5))
      else {
        const startIndex = page * 10
        const endIndex = Math.min(startIndex + 10, list.length)
        let newRecords
        if (globalStore.setSelectedItem) newRecords = list
        else newRecords = [...records, ...list.slice(startIndex, endIndex)]

        setRecords(newRecords)
      }
    }, [page, list, checkBillingType, globalStore.setSelectedItem])

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

    const sortByPublicationDate = (direction) => {
      const sortedData = [...list].sort((a, b) => {
        const dateA = new Date(a.publicationDate)
        const dateB = new Date(b.publicationDate)
        return direction === 'asc' ? dateA - dateB : dateB - dateA
      })
      setSearchResults(sortedData.slice(0, records.length))
      setSortDirection(direction)
    }
    const getStatus = (item) => {
      const hasUndefined = item.duplicates.some((dup) => dup.type === undefined)
      return hasUndefined ? 0 : 1
    }
    const sortByStatus = (direction) => {
      const sortedData = [...list].sort((a, b) => {
        const statusA = getStatus(a)
        const statusB = getStatus(b)
        return direction === 'asc' ? statusA - statusB : statusB - statusA
      })
      setSearchResults(sortedData.slice(0, records.length))
      setSortStatusDirection(direction)
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
                <img src={infoAction} style={{ color: '#757575' }} alt="" />
              }
            />
          ) : (
            <Actions
              downloadUrl={duplicatesUrl}
              description={texts.info.listOfDuplicates}
              hoverIcon={
                <img src={infoAction} style={{ color: '#757575' }} alt="" />
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
        <DashboardCachedMessage title={texts.cachedInfo.title} />
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
            searchable={!checkBillingType}
            localSearch
            localSearchTerm={localSearchTerm}
            searchChange={searchChange}
            fetchData={fetchData}
            rowActionProp
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
              sortDirection={sortStatusDirection}
              onClick={() =>
                sortByStatus(sortStatusDirection === 'asc' ? 'desc' : 'asc')
              }
              icon
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
            <Table.Column
              id="publicationDate"
              display="Publication date"
              className={styles.publicationDateColumn}
              getter={(v) => v?.publicationDate}
              sortDirection={sortDirection}
              onClick={() =>
                sortByPublicationDate(sortDirection === 'asc' ? 'desc' : 'asc')
              }
              icon
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
