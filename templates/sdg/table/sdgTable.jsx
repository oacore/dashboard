import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Popover } from '@oacore/design'

import { ProgressSpinner, Card } from '../../../design'
import request from '../../../api'
import styles from '../styles.module.css'
import Tablev2 from '../../../components/tablev2/tablev2'
import { formatNumber } from '../../../utils/helpers'
import ExportButton from '../../../components/export-button'
import { GlobalContext } from '../../../store'
import TableArticle from '../../../components/dropdownTableCard/article'
import texts from '../../../texts/sdg/sdg.yml'
import AccessPlaceholder from '../../../components/access-placeholder/AccessPlaceholder'

import Table from 'components/table'

const SdgTable = observer(
  ({
    visibleColumns,
    sdgUrl,
    getSdgTableData,
    sdgTableList,
    sdgTypes,
    sdgTableDataLoading,
    articleAdditionalData,
    articleAdditionalDataLoading,
    outputCount,
    startDate,
    endDate,
    checkBillingType,
  }) => {
    const router = useRouter()
    const providerId = router.query['data-provider-id']

    const { ...globalStore } = useContext(GlobalContext)

    const [outputsUrl, setOutputsUrl] = useState()
    const [page, setPage] = useState(0)
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)

    //  TEMP UNTIL WE WILL HAVE SDG IN API CALL
    const [updatedArticleData, setUpdatedArticleData] = useState(
      articleAdditionalData
    )

    useEffect(() => {
      const fetchData = async () => {
        setPage(0)
        await getSdgTableData(
          providerId,
          0,
          50,
          localSearchTerm,
          startDate,
          endDate,
          visibleColumns
        )
        setInitialLoad(false)
      }
      if (providerId) fetchData()
    }, [providerId, startDate, endDate, visibleColumns])

    const fetchData = async () => {
      if (sdgTableDataLoading || sdgTableList?.length === outputCount) return

      const from = (page + 1) * 50
      const size = 50

      try {
        await getSdgTableData(
          providerId,
          from,
          size,
          localSearchTerm,
          startDate,
          endDate,
          visibleColumns
        )
        setPage((prevPage) => prevPage + 1)
      } catch (error) {
        console.error('Error fetching additional data:', error)
      }
    }

    const getSdgIcon = (type, score) => {
      const sdg = sdgTypes.find((sdgItem) => sdgItem.id === type)
      return sdg ? (
        <Popover
          placement="top"
          content={`${sdg.title} - ${score} (confidence)`}
        >
          <img className={styles.sdgItem} src={sdg.icon} alt={type} />
        </Popover>
      ) : (
        type
      )
    }

    const onSetActiveArticle = async (row) => {
      await globalStore.dataProvider.getOutputsAdditionalData(row.id)
      setOutputsUrl(`https://core.ac.uk/outputs/${row.id}`)
    }

    const changeArticleVisibility = async (article) => {
      setLoading(true)
      try {
        await request(`/articles/${article.id}`, {
          method: 'PATCH',
          body: { disabled: !article?.disabled },
        })
        setIsDisabled(!isDisabled)
        Object.assign(articleAdditionalData, {
          disabled: !articleAdditionalData?.disabled,
        })
      } catch (error) {
        throw Error(error)
      } finally {
        setLoading(false)
      }
    }

    //  TEMP UNTIL WE WILL HAVE SDG IN API CALL
    useEffect(() => {
      if (articleAdditionalData && sdgTableList) {
        const sdgItem = sdgTableList.find(
          (sdg) => sdg.id === articleAdditionalData.id
        )
        if (sdgItem) {
          const updatedData = {
            ...articleAdditionalData,
            sdg: sdgItem.sdg,
          }
          setUpdatedArticleData(updatedData)
        }
      }
    }, [articleAdditionalData, sdgTableList])

    const onSearchChange = async (event) => {
      const searchTerm = event.target.value
      setLocalSearchTerm(searchTerm)
      setPage(0)
      await getSdgTableData(
        providerId,
        0,
        50,
        searchTerm,
        startDate,
        endDate,
        visibleColumns
      )
    }

    return (
      <Card className={styles.sdgTableWrapper} id="rrsTable">
        <Card.Title tag="h2">{texts.table.title}</Card.Title>
        <div className={styles.itemCountIndicator}>
          We have found {formatNumber(outputCount)} papers tagged with SDGs.
          Review and download them below.
        </div>
        {initialLoad ? (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        ) : (
          <Tablev2
            className={styles.sdgTable}
            isHeaderClickable
            rowIdentifier="articleId"
            data={checkBillingType ? sdgTableList.slice(0, 10) : sdgTableList}
            size={sdgTableList?.length}
            totalLength={formatNumber(outputCount)}
            rowClick={(row) => onSetActiveArticle(row)}
            fetchData={fetchData}
            searchable
            isLoading={sdgTableDataLoading}
            localSearch
            localSearchTerm={localSearchTerm}
            searchChange={onSearchChange}
            renderDropDown={articleAdditionalData}
            excludeFooter={checkBillingType}
            details={
              <TableArticle
                changeVisibility={changeArticleVisibility}
                article={updatedArticleData}
                loading={loading}
                outputsUrl={outputsUrl}
                articleAdditionalDataLoading={articleAdditionalDataLoading}
                getSdgIcon={getSdgIcon}
                removeLiveActions
              />
            }
          >
            <Table.Column
              id="oai"
              display="OAI"
              getter={(v) => {
                if (v.oai) {
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
              id="sdg"
              display="SDG"
              getter={(v) => {
                const sortedSdg = v.sdg.sort((a, b) => b.score - a.score)
                const firstTwoSdgIcons = sortedSdg
                  .slice(0, 2)
                  .map((item) => getSdgIcon(item.type, item.score))
                const additionalCount =
                  sortedSdg.length > 2 ? `+${sortedSdg.length - 2}` : ''
                return (
                  <div className={styles.sdgRow}>
                    {firstTwoSdgIcons}
                    {additionalCount && (
                      <span className={styles.additionalCount}>
                        {additionalCount}
                      </span>
                    )}
                  </div>
                )
              }}
              className={styles.sdgColumn}
            />
            <Table.Column
              id="title"
              display="Title"
              getter={(v) => (
                <Popover placement="top" content={v.title || '-'}>
                  <div className={`${styles.titleColumn} ${styles.ellipsis}`}>
                    {v.title || '-'}
                  </div>
                </Popover>
              )}
              className={styles.titleColumn}
            />
            <Table.Column
              id="authors"
              display="Authors"
              className={styles.authorsColumn}
              getter={(v) => {
                const authors = v.authors
                  .map((author) => author.name)
                  .join(', ')
                return (
                  <Popover placement="top" content={authors}>
                    <div
                      className={`${styles.authorsColumn} ${styles.ellipsis}`}
                    >
                      {authors}
                    </div>
                  </Popover>
                )
              }}
            />
            <Table.Column
              id="publicationDate"
              display="Publication date"
              className={styles.publicationDateColumn}
              getter={(v) => (
                <div className={styles.publicationDateCell}>
                  {v.publishedDate?.split('T')[0]}
                </div>
              )}
              icon
            />
            <Table.Action>
              <ExportButton href={sdgUrl}>download csv</ExportButton>
            </Table.Action>
          </Tablev2>
        )}
        {checkBillingType && (
          <AccessPlaceholder
            dataProviderData={globalStore.dataProvider}
            customWidth
            description="To see all  SDG labeled papers become our  Supporting or Sustaining member. Try [SDG Insights DEMO]()."
          />
        )}
      </Card>
    )
  }
)

export default SdgTable
