import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Popover } from '@oacore/design'

import styles from '../styles.module.css'
import { Card, ProgressSpinner } from '../../../design'
import texts from '../../../texts/sdg/sdg.yml'
import Tablev2 from '../../../components/tablev2/tablev2'
import { GlobalContext } from '../../../store'
import request from '../../../api'
import ExportButton from '../../../components/export-button'
import TableArticle from '../../../components/dropdownTableCard/article'

import Table from 'components/table'

const SdgTable = observer(
  ({
    sdgUrl,
    getSdgTableData,
    sdgTableList,
    sdgTypes,
    sdgTableDataLoading,
    articleAdditionalData,
    articleAdditionalDataLoading,
  }) => {
    const router = useRouter()
    const providerId = router.query['data-provider-id']

    const { ...globalStore } = useContext(GlobalContext)

    const [outputsUrl, setOutputsUrl] = useState()
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [tableData, setTableData] = useState([])
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])

    //  TEMP UNTIL WE WILL HAVE SDG IN API CALL
    const [updatedArticleData, setUpdatedArticleData] = useState(
      articleAdditionalData
    )

    useEffect(() => {
      getSdgTableData(providerId)
    }, [providerId])

    useEffect(() => {
      if (sdgTableList) {
        setSearchResults(sdgTableList)
        setTableData(sdgTableList.slice(0, 10))
      }
    }, [sdgTableList])

    const fetchData = () => {
      const startIndex = (page + 1) * 10
      const endIndex = Math.min(startIndex + 10, searchResults.length)
      const newData = searchResults.slice(startIndex, endIndex)
      setTableData((prevData) => [...prevData, ...newData])
      setPage(page + 1)
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

    useEffect(() => {
      const lowerSearchTerm = localSearchTerm.toLowerCase()
      if (lowerSearchTerm) {
        const filteredData = sdgTableList.filter(
          (record) =>
            record.oai.toLowerCase().includes(lowerSearchTerm) ||
            record.title.toLowerCase().includes(lowerSearchTerm) ||
            record.authors.some((author) =>
              author.name.toLowerCase().includes(lowerSearchTerm)
            )
        )
        setSearchResults(filteredData)
        setTableData(filteredData.slice(0, 10))
      } else {
        setSearchResults(sdgTableList)
        setTableData(sdgTableList.slice(0, 10))
      }
    }, [localSearchTerm, sdgTableList])

    const searchChange = (event) => {
      setLocalSearchTerm(event.target.value)
      setPage(0)
    }

    return (
      <Card className={styles.sdgTableWrapper} id="rrsTable">
        <Card.Title tag="h2">{texts.table.title}</Card.Title>
        <div className={styles.itemCountIndicator}>
          We have found {sdgTableList?.length} paper with SDG. Review and
          download them below.
        </div>
        {sdgTableDataLoading ? (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        ) : (
          <>
            <Tablev2
              className={styles.sdgTable}
              isHeaderClickable
              rowIdentifier="articleId"
              data={tableData}
              size={tableData?.length}
              totalLength={searchResults?.length}
              rowClick={(row) => onSetActiveArticle(row)}
              fetchData={fetchData}
              searchable
              localSearch
              localSearchTerm={localSearchTerm}
              searchChange={searchChange}
              renderDropDown={articleAdditionalData}
              details={
                <TableArticle
                  changeVisibility={changeArticleVisibility}
                  article={updatedArticleData}
                  loading={loading}
                  outputsUrl={outputsUrl}
                  articleAdditionalDataLoading={articleAdditionalDataLoading}
                  getSdgIcon={getSdgIcon}
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
          </>
        )}
      </Card>
    )
  }
)

export default SdgTable
