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
    //  TEMP UNTIL WE WILL HAVE SDG IN API CALL
    const [updatedArticleData, setUpdatedArticleData] = useState(
      articleAdditionalData
    )

    useEffect(() => {
      getSdgTableData(providerId)
    }, [providerId])

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

    const fetchData = () => {
      setPage(page + 1)
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

    return (
      <Card className={styles.sdgTableWrapper} id="rrsTable">
        <Card.Title tag="h2">{texts.table.title}</Card.Title>
        <div className={styles.itemCountIndicator}>
          We have found 32,456 paper with SDG. Review and download them below.
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
              data={sdgTableList}
              size={sdgTableList?.length}
              totalLength={sdgTableList?.length}
              rowClick={(row) => onSetActiveArticle(row)}
              fetchData={fetchData}
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
                getter={(v) => v.title || '-'}
                className={styles.titleColumn}
              />
              <Table.Column
                id="authors"
                display="Authors"
                className={styles.authorsColumn}
                getter={(v) => v.authors.map((author) => author.name).join(' ')}
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
