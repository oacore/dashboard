import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import texts from '../../../texts/rrs-retention/rrs.yml'
import RrsWarning from '../cards/warningCard'
import ExportButton from '../../../components/export-button'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import accept from '../../../components/upload/assets/accept.svg'
import deny from '../../../components/upload/assets/deny.svg'
import question from '../../../components/upload/assets/questionMarkLight.svg'
import redirect from '../../../components/upload/assets/urlRedirect.svg'
import Menu from '../../../components/menu'
import Article from '../cards/article'
import request from '../../../api'
import StatusCard from '../cards/statusCard'

import Table from 'components/table'

const RrsTable = observer(
  ({
    rrsList,
    getRrslistData,
    updateRrsStatus,
    rrsAdditionalData,
    getOutputsAdditionalData,
    rrsAdditionalDataLoading,
  }) => {
    const [visibleHelp, setVisibleHelp] = useState(
      localStorage.getItem('rrsHelp') === 'true'
    )
    const [tableData, setTableData] = useState([])
    const [page, setPage] = useState(-1)
    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [outputsUrl, setOutputsUrl] = useState()
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [sortDirection, setSortDirection] = useState('asc')
    const [statusSortDirection, setStatusSortDirection] = useState('asc')

    const router = useRouter()
    const providerId = router.query['data-provider-id']

    const changeArticleVisibility = async (article) => {
      setLoading(true)
      try {
        await request(`/articles/${article.id}`, {
          method: 'PATCH',
          body: { disabled: !article?.disabled },
        })
        setIsDisabled(!isDisabled)
        Object.assign(rrsAdditionalData, {
          disabled: !rrsAdditionalData?.disabled,
        })
      } catch (error) {
        throw Error(error)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      const newRecords = [
        ...tableData,
        ...rrsList?.slice(page * 10, (page + 1) * 10),
      ]
      const newRRS = newRecords.map((item) => ({
        ...item,
        id: +item.articleId,
        output: null,
      }))
      setTableData(newRRS)
    }, [rrsList, page])

    useEffect(() => {
      localStorage.setItem('rrsHelp', visibleHelp)
    }, [visibleHelp])

    useEffect(() => {
      getRrslistData(providerId)
    }, [providerId])

    const handleClick = (e, rowDetail) => {
      e.preventDefault()
      e.stopPropagation()
      setSelectedRowData(rowDetail)
      setVisibleMenu(!visibleMenu)
    }

    const handleStatusUpdate = async (e, articleId, validationStatus) => {
      e.preventDefault()
      e.stopPropagation()
      const currentArticle = tableData.find(
        (item) => item.articleId === articleId
      )
      setLoadingStatus(true)
      try {
        await updateRrsStatus(providerId, articleId, validationStatus)
        currentArticle.validationStatusRRS = validationStatus
        setTableData((prevTableData) => {
          const updatedTableData = prevTableData.map((item) =>
            item.articleId === articleId ? currentArticle : item
          )
          return updatedTableData
        })
      } catch (error) {
        console.error('Error updating status:', error)
      } finally {
        setLoadingStatus(false)
        setShowStatusModal(false)
      }
    }

    const handleToggleRedirect = (e, key, outputsId, oaiId) => {
      e.preventDefault()
      e.stopPropagation()
      setVisibleMenu(false)
      if (key === 'coreUrl')
        window.open(`https://core.ac.uk/outputs/${outputsId}`, '_blank')
      else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
    }

    const onSetActiveArticle = async (row) => {
      await getOutputsAdditionalData(row.id)
      setOutputsUrl(`https://core.ac.uk/outputs/${row.id}`)
    }

    const handleStatusModal = (e, rowData) => {
      setSelectedRowData(rowData)
      setShowStatusModal(true)
      e.stopPropagation()
    }

    const sortByPublicationDate = (direction) => {
      const sortedData = [...rrsList].sort((a, b) => {
        const dateA = new Date(a.publicationDate).getTime()
        const dateB = new Date(b.publicationDate).getTime()
        return direction === 'asc' ? dateA - dateB : dateB - dateA
      })

      setTableData(sortedData.slice(0, tableData.length))
      setSortDirection(direction)
    }

    const getStatusIcon = (validationStatusRRS) => {
      if (validationStatusRRS === undefined || validationStatusRRS === null)
        return question
      if (validationStatusRRS === 0) return deny

      return accept
    }

    const sortByStatus = (direction) => {
      const sortedData = [...tableData].sort((a, b) =>
        direction === 'asc'
          ? a.validationStatusRRS - b.validationStatusRRS
          : b.validationStatusRRS - a.validationStatusRRS
      )

      setTableData(sortedData)
      setStatusSortDirection(direction)
    }

    return (
      <Card>
        <Card.Title tag="h2">{texts.table.title}</Card.Title>
        <div className={styles.itemCountIndicator}>{texts.table.subTitle}</div>
        <RrsWarning
          show={texts.helpInfo.show}
          hide={texts.helpInfo.hide}
          description={texts.helpInfo.description}
          setText={setVisibleHelp}
          activeText={visibleHelp}
        />
        <Table
          className={styles.rrsTable}
          rowActionProp
          data={tableData}
          totalLength={rrsList?.length}
          size={tableData?.length}
          isHeaderClickable
          renderDropDown={rrsAdditionalData}
          fetchData={() => setPage(page + 1)}
          // defaultRowClick={onSetActiveArticle}
          rowClick={(row) => onSetActiveArticle(row)}
          onClick={() =>
            sortByPublicationDate(sortDirection === 'asc' ? 'desc' : 'asc')
          }
          handleCLick={() =>
            sortByStatus(statusSortDirection === 'asc' ? 'desc' : 'asc')
          }
          sortDirection={sortDirection}
          sortStatusDirection={statusSortDirection}
          showAdditionalSort
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
            // cellClassName={styles.oaiCell}
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
            getter={(v) => v?.authors}
          />
          <Table.Column
            id="publicationDate"
            display="Publication date"
            className={styles.publicationDateColumn}
            getter={(v) => (
              <div className={styles.publicationDateCell}>
                {v.publicationDate?.split('T')[0]}
              </div>
            )}
          />
          <Table.Column
            id="licence"
            display="Identified licence"
            className={styles.licenceColumn}
            getter={(v) =>
              v.licenceRecognised && (
                <div className={`${styles.licence} ${styles.truncated}`}>
                  {v.licenceRecognised?.length > 10
                    ? `${v.licenceRecognised.substring(0, 10)}...`
                    : v.licenceRecognised}
                </div>
              )
            }
          />
          <Table.Column
            id="rrs"
            display="Extracted RRS"
            className={styles.publicationColumn}
            getter={(v) => (
              <a
                target="_blank"
                href={`https://core.ac.uk/reader/${v.articleId}`}
                className={styles.redirectLink}
                rel="noreferrer"
              >
                Review RRS
                <img src={redirect} alt="" />
              </a>
            )}
          />
          <Table.Column
            id="status"
            display="Status"
            getter={(v) => (
              <div>
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                  className={styles.statusWrapper}
                  onClick={(e) => handleStatusModal(e, v)}
                >
                  <img
                    src={getStatusIcon(v.validationStatusRRS)}
                    alt="status icon"
                    className={styles.visibilityIcon}
                  />
                </div>
                {showStatusModal && selectedRowData === v && (
                  <StatusCard
                    handleStatusUpdate={handleStatusUpdate}
                    onClose={() => setShowStatusModal(false)}
                    v={v}
                    loadingStatus={loadingStatus}
                  />
                )}
              </div>
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
                          handleToggleRedirect(e, key, v.articleId, v.oai)
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
          <Table.Details>
            <Article
              changeVisibility={changeArticleVisibility}
              article={rrsAdditionalData}
              loading={loading}
              outputsUrl={outputsUrl}
              rrsAdditionalDataLoading={rrsAdditionalDataLoading}
            />
          </Table.Details>
          <Table.Action>
            <ExportButton>download csv</ExportButton>
          </Table.Action>
        </Table>
      </Card>
    )
  }
)

export default RrsTable
