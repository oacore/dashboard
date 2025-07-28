import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useRef, useState } from 'react'

import styles from '../styles.module.css'
import { Button, ProgressSpinner } from '../../../design'
import Tablev2 from '../../../components/tablev2/tablev2'
import Table from '../../../components/table'
import ExportButton from '../../../components/export-button'
import { formatNumber } from '../../../utils/helpers'
import checkGreen from '../../../components/upload/assets/checkGreen.svg'
import arrowRight from '../../../components/upload/assets/buttonArrow.svg'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'
import texts from '../../../texts/sw/sw.yml'
import NotificationModal from '../components/notificationModal'
import { GlobalContext } from '../../../store'
import warning from '../../../components/upload/assets/warningDark.svg'

const SidebarContent = ({
  context: { oai, authors, title, softwareCitations },
  onClose,
}) => {
  const { Header, Body, Footer } = Table.Sidebar
  const [modalOpen, setModalOpen] = useState(false)

  const triggerModal = () => {
    setModalOpen(true)
  }

  const handleButtonClose = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Header className={styles.header}>{oai}</Header>
      <Body>
        <h5 className={styles.sidebarHeaderTitle}>
          <b>{title}</b>
        </h5>
        <p className={styles.sidebarAuth}>
          {authors?.map((name) => name).join(' ')}
        </p>
        <div className={styles.sectionMainWrapper}>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h6>Software name</h6>
              <img src={checkGreen} alt="" />
            </div>
            <p>{softwareCitations[0].software}</p>
          </div>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h6>Software mention context</h6>
              <img src={checkGreen} alt="" />
            </div>
            <p>{softwareCitations[0].context}</p>
          </div>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h6>Mention type</h6>
              <img src={checkGreen} alt="" />
            </div>
            <p>{softwareCitations[0].type}</p>
          </div>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h6>Software repository link</h6>
              <img src={checkGreen} alt="" />
            </div>
            <p>{softwareCitations[0].url}</p>
          </div>
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionHeader}>
              <h6>Confidence</h6>
              <img src={checkGreen} alt="" />
            </div>
            <p>{softwareCitations[0].confidence || 66}</p>
          </div>
        </div>
      </Body>
      <Footer className={styles.buttonWrapper}>
        <Button
          className={`${styles.sidebarButton} `}
          variant="contained"
          onClick={triggerModal}
        >
          Approve and send notification
          <img src={arrowRight} alt="arrowRight" />
        </Button>
        <Button
          className={`${styles.closeButton}`}
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
      </Footer>
      {modalOpen && (
        <NotificationModal
          title={texts.notificationModal.title}
          description={texts.notificationModal.description}
          action={texts.notificationModal.action}
          handleButtonClose={handleButtonClose}
        />
      )}
    </>
  )
}

const ReadySwTableComponent = observer(
  ({
    initialLoad,
    data,
    isLoading,
    totalLength,
    localSearchTerm,
    fetchData,
    onSearchChange,
    hasError,
    currentTab,
  }) => {
    const menuRef = useRef(null)

    const [visibleMenu, setVisibleMenu] = useState(false)
    const [selectedRowData, setSelectedRowData] = useState(null)
    const { ...globalStore } = useContext(GlobalContext)

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

    const handleToggleRedirect = (e, key, outputsId, oaiId) => {
      e.preventDefault()
      e.stopPropagation()
      setVisibleMenu(false)
      if (key === 'coreUrl')
        window.open(`https://core.ac.uk/outputs/${outputsId}`, '_blank')
      else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
    }

    const renderContent = () => {
      if (initialLoad) {
        return (
          <div className={styles.dataSpinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        )
      }

      if (hasError) {
        return (
          <div className={styles.dataSpinnerWrapper}>
            <img src={warning} alt="warning" />
            <p className={styles.spinnerText}>
              {/* eslint-disable-next-line max-len */}
              {/* eslint-disable-next-line max-len,react/no-unescaped-entities */}
              Sorry, we couldn't download the page at the moment. Please try
              again in a few minutes.
            </p>
          </div>
        )
      }

      // eslint-disable-next-line max-len
      // Only show "no data" message if there's no error and data is legitimately empty
      if (!hasError && (!data || data.length === 0)) {
        return (
          <div className={styles.dataSpinnerWrapper}>
            <p className={styles.spinnerText}>
              There are no software mentions available.
            </p>
          </div>
        )
      }

      return (
        <Tablev2
          className={styles.orcidTable}
          isHeaderClickable
          rowIdentifier="articleId"
          data={data}
          size={data?.length}
          totalLength={formatNumber(totalLength)}
          localSearch
          localSearchTerm={localSearchTerm}
          fetchData={fetchData}
          isLoading={isLoading}
          searchChange={onSearchChange}
          searchable
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
            getter={(v) => v?.authors}
          />
          <Table.Column
            id="Status"
            display="Status"
            className={styles.statusColumn}
            getter={() => (
              <div className={styles.statusType}>Ready to be sent</div>
            )}
          />
          <Table.Column
            id="action"
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
            <ExportButton
              href={
                globalStore.dataProvider.swUrls?.[currentTab] ||
                globalStore.dataProvider.swUrl
              }
            >
              download csv
            </ExportButton>
          </Table.Action>
          <Table.Sidebar>
            <SidebarContent />
          </Table.Sidebar>
        </Tablev2>
      )
    }

    return <div id="readySwTable">{renderContent()}</div>
  }
)

export default ReadySwTableComponent
