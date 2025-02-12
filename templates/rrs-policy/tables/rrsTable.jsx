import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@oacore/design/lib/elements'
import { Popover } from '@oacore/design'

import styles from '../styles.module.css'
import { Card, ProgressSpinner } from '../../../design'
import texts from '../../../texts/rrs-retention/rrs.yml'
import RrsWarning from '../cards/warningCard'
import ExportButton from '../../../components/export-button'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import accept from '../../../components/upload/assets/accept.svg'
import deny from '../../../components/upload/assets/deny.svg'
import question from '../../../components/upload/assets/questionMarkLight.svg'
import redirect from '../../../components/upload/assets/urlRedirect.svg'
import Menu from '../../../components/menu'
import request from '../../../api'
import StatusCard from '../cards/statusCard'
import AccessPlaceholder from '../../../components/access-placeholder/AccessPlaceholder'
import Tablev2 from '../../../components/tablev2/tablev2'
import { GlobalContext } from '../../../store'
import TableArticle from '../../../components/dropdownTableCard/article'

import Table from 'components/table'

const RrsTable = observer(
  ({
    rrsList,
    getRrslistData,
    updateRrsStatus,
    articleAdditionalData,
    getOutputsAdditionalData,
    articleAdditionalDataLoading,
    rrsDataLoading,
    checkBillingType,
    dataProviderData,
    rrsUrl,
  }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const [visibleHelp, setVisibleHelp] = useState(
      localStorage.getItem('rrsHelp') === 'true'
    )
    const [tableData, setTableData] = useState([])
    const [page, setPage] = useState(0)
    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [outputsUrl, setOutputsUrl] = useState()
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [sortDirection, setSortDirection] = useState('asc')

    const router = useRouter()
    const menuRef = useRef(null)
    const providerId = router.query['data-provider-id']

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

    useEffect(() => {
      if (checkBillingType) {
        const newRRS = rrsList.slice(0, 5).map((item) => ({
          ...item,
          id: +item.articleId,
          output: null,
        }))
        setTableData(newRRS)
      } else {
        const startIndex = page * 10
        const endIndex = Math.min(startIndex + 10, rrsList.length)
        let newRRS
        if (globalStore.setSelectedItem) {
          newRRS = rrsList.map((item) => ({
            ...item,
            id: +item.articleId,
            output: null,
          }))
        } else {
          newRRS = [...tableData, ...rrsList.slice(startIndex, endIndex)].map(
            (item) => ({
              ...item,
              id: +item.articleId,
              output: null,
            })
          )
        }
        setTableData(newRRS)
      }
    }, [rrsList, page, checkBillingType])

    useEffect(() => {
      localStorage.setItem('rrsHelp', visibleHelp)
    }, [visibleHelp])

    useEffect(() => {
      getRrslistData(providerId)
    }, [providerId])

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target))
          setVisibleMenu(false)
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [menuRef])

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
      await getOutputsAdditionalData(row.articleId)
      setOutputsUrl(`https://core.ac.uk/outputs/${row.articleId}`)
    }

    const handleStatusModal = (e, rowData) => {
      setSelectedRowData(rowData)
      setShowStatusModal(true)
      e.stopPropagation()
    }

    const fetchData = () => {
      setPage(page + 1)
    }

    const sortByPublicationDate = (direction) => {
      const sortedData = [...rrsList].sort((a, b) => {
        const dateA = new Date(a.publicationDate).getTime()
        const dateB = new Date(b.publicationDate).getTime()
        return direction === 'asc' ? dateA - dateB : dateB - dateA
      })
      setTableData(sortedData)
      setSortDirection(direction)
    }

    const getStatusIcon = (validationStatusRRS) => {
      if (validationStatusRRS === 0)
        return { icon: question, text: 'To be reviewed' }
      if (validationStatusRRS === 1)
        return { icon: deny, text: 'Review not confirmed' }

      return { icon: accept, text: 'Review confirmed' }
    }

    return (
      <Card className={styles.rrsTableWrapper} id="rrsTable">
        <Card.Title tag="h2">{texts.table.title}</Card.Title>
        <div className={styles.itemCountIndicator}>{texts.table.subTitle}</div>
        {rrsDataLoading ? (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        ) : (
          <>
            <RrsWarning
              show={texts.helpInfo.show}
              hide={texts.helpInfo.hide}
              description={texts.helpInfo.description}
              setText={setVisibleHelp}
              activeText={visibleHelp}
            />
            <Tablev2
              rowClick={(row) => onSetActiveArticle(row)}
              className={styles.rrsTable}
              data={tableData}
              size={tableData?.length}
              totalLength={rrsList?.length}
              fetchData={fetchData}
              isHeaderClickable
              rowIdentifier="articleId"
              excludeFooter={checkBillingType}
              renderDropDown={articleAdditionalData}
              details={
                <TableArticle
                  changeVisibility={changeArticleVisibility}
                  article={articleAdditionalData}
                  loading={loading}
                  outputsUrl={outputsUrl}
                  articleAdditionalDataLoading={articleAdditionalDataLoading}
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
                onClick={() =>
                  sortByPublicationDate(
                    sortDirection === 'asc' ? 'desc' : 'asc'
                  )
                }
                sortDirection={sortDirection}
                icon
              />
              <Table.Column
                id="licence"
                display="Identified licence"
                className={styles.licenceColumn}
                getter={(v) =>
                  v.licenceRecognised && (
                    <Popover
                      className={styles.popover}
                      placement="top"
                      content={v.licenceRecognised}
                    >
                      <div className={`${styles.licence} ${styles.truncated}`}>
                        {v.licenceRecognised?.length > 10
                          ? `${v.licenceRecognised.substring(0, 10)}...`
                          : v.licenceRecognised}
                      </div>
                    </Popover>
                  )
                }
              />
              <Table.Column
                id="rrs"
                display="Extracted RRS"
                className={styles.publicationColumn}
                getter={(v) => (
                  <>
                    <Button
                      target="_blank"
                      className={styles.redirectLink}
                      onClick={(e) => handleStatusModal(e, v)}
                      rel="noreferrer"
                    >
                      Review RRS
                      <img src={redirect} alt="" />
                    </Button>
                    {showStatusModal && selectedRowData === v && (
                      <StatusCard
                        handleStatusUpdate={handleStatusUpdate}
                        onClose={() => setShowStatusModal(false)}
                        v={v}
                        loadingStatus={loadingStatus}
                        href={`https://core.ac.uk/reader/${v.articleId}`}
                      />
                    )}
                  </>
                )}
              />
              <Table.Column
                id="status"
                display="Status"
                getter={(v) => (
                  <div>
                    <div className={styles.statusWrapper}>
                      <Popover
                        className={styles.popover}
                        placement="top"
                        content={getStatusIcon(v.validationStatusRRS).text}
                      >
                        <img
                          src={getStatusIcon(v.validationStatusRRS).icon}
                          alt="status icon"
                          className={styles.visibilityIcon}
                        />
                      </Popover>
                    </div>
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
                      ref={menuRef}
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
              <Table.Action>
                <ExportButton href={rrsUrl}>download csv</ExportButton>
              </Table.Action>
            </Tablev2>
            {checkBillingType && (
              <AccessPlaceholder
                dataProviderData={dataProviderData}
                customWidth
                description="To see and download the full list of outputs with RRS statements found in your repository become our Supporting or Sustaining member."
              />
            )}
          </>
        )}
      </Card>
    )
  }
)

export default RrsTable
