import React, { useRef, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { DataProviderLogo } from '@oacore/design/lib/elements'
import { useRouter } from 'next/router'

import { AppBar, Container, Main, SideBar } from '../layout'
import activities from './activities'
import LoadingBar from './loading-bar'
import TermsConditionPopup from './terms-condition'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'
import Logout from './logout'
import styles from './styles.module.css'
import DashboardGuide from '../dashboard-tutorial/dashboardGuide'
import imagePlaceholder from '../upload/assets/imagePlaceholder.svg'
import repositoryIcon from '../upload/assets/repositoryIcon.svg'
import restart from '../upload/assets/restart.svg'
import notification from '../../templates/settings/assets/bell.svg'
import NotificationPopUp from '../../templates/settings/cards/notificationPopUp'
import { useNotification } from './useNotification'
import { GlobalContext } from '../../store'
import FeedbackButton from '../feedback-button'

const Application = observer(
  ({
    children,
    dataProvider,
    userID,
    pathname,
    user,
    seeAllNotifications,
    variant = 'public', // 'public' or 'internal'
    isAuthenticated = false,
    acceptedTCVersion = 0,
    tutorial,
    ...restProps
  }) => {
    const logoRef = useRef(null)
    const siderRef = useRef(null)
    const settingsRef = useRef(null)
    const [showNotification, setShowNotification] = useState(false)
    const router = useRouter()
    const { notifications, refetch } = useNotification(userID)
    const [showSubMenuState, setShowSubMenuState] = useState({})
    const handleShowSubMenu = (key) => {
      setShowSubMenuState((prevState) => ({
        ...prevState,
        [key]: !prevState[key] || false,
      }))
    }
    const handleShowNotification = () => {
      setShowNotification(!showNotification)
    }

    const closeNotification = () => {
      setShowNotification(false)
    }

    const navigateToPage = () => {
      router.push(
        `/data-providers/${dataProvider.id}/repository?referrer=upload`
      )
    }

    const handleNotificationClick = async (
      id,
      notificationId,
      dataProviderId
    ) => {
      try {
        await fetch(`${process.env.API_URL}/notifications/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notification_id: notificationId,
          }),
        })

        await refetch(id)
        router.push(`/data-providers/${dataProviderId}/indexing`)
        setShowNotification(false)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }

    const restartModal = () => {
      tutorial.currentStep = 1
      tutorial.openModal()
      if (!pathname.includes('overview'))
        router.push(`/data-providers/${dataProvider.id}/overview`)
    }
    const displayedNotifications = notifications?.slice(0, 10)

    const unseenNotification = displayedNotifications.filter(
      (item) => !item?.readStatus
    )

    const truncate = (str, maxLength) => {
      if (str.length <= maxLength) return str
      return `${str.substring(0, maxLength)}...`
    }

    const { ...globalStore } = useContext(GlobalContext)

    const disabledTabs = [
      'indexing',
      'deduplication',
      'content',
      'deposit-compliance',
      'sdg',
      'das',
      'doi',
      'rights-retention-strategy',
      'research-software',
      'orcid',
      'usrn',
      'settings',
    ]

    return (
      <>
        <Head>
          <title />
        </Head>
        {isAuthenticated ? (
          <TermsConditionPopup acceptedTCVersion={acceptedTCVersion} />
        ) : null}
        <Container variant={variant} {...restProps}>
          <LoadingBar fixed />
          <div>
            <AppBar>
              {isAuthenticated ? (
                <>
                  <>
                    <>
                      <img
                        className={styles.repositoryLogo}
                        src={repositoryIcon}
                        alt=""
                      />
                      {dataProvider && (
                        <RepositorySelect value={dataProvider} />
                      )}
                      <div className={styles.bellWrapper}>
                        {/* eslint-disable-next-line max-len */}
                        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
                        <img
                          onClick={handleShowNotification}
                          src={notification}
                          alt="notification"
                        />
                        {unseenNotification.length > 0 && (
                          <div className={styles.count}>
                            {unseenNotification.length}
                          </div>
                        )}
                        {showNotification && (
                          <NotificationPopUp
                            handleNotificationClick={handleNotificationClick}
                            displayedNotifications={displayedNotifications}
                            notifications={notifications}
                            userID={userID}
                            closeNotification={closeNotification}
                            seeAllNotifications={seeAllNotifications}
                            user={user}
                            dataProviderId={dataProvider.id}
                          />
                        )}
                      </div>
                      <Logout />
                    </>
                  </>
                </>
              ) : null}
            </AppBar>
            {tutorial && tutorial.currentStep === 2 && (
              <DashboardGuide
                dataProviderData={dataProvider}
                tutorial={tutorial}
                targetRef={logoRef}
              />
            )}
          </div>
          <div ref={siderRef}>
            {variant === 'internal' && (
              <>
                <SideBar tag="nav">
                  <h2 className="sr-only">Navigate your data</h2>
                  <>
                    {/* eslint-disable-next-line max-len */}
                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
                    <div
                      className={styles.logoWrapper}
                      onClick={navigateToPage}
                      ref={logoRef}
                    >
                      {dataProvider?.logo ? (
                        <DataProviderLogo
                          size="ml"
                          imageSrc={dataProvider?.logo}
                          alt={dataProvider.name}
                        />
                      ) : (
                        <img
                          className={styles.repositoryLogoBig}
                          src={imagePlaceholder}
                          alt=""
                        />
                      )}
                    </div>
                    {dataProvider?.institution ? (
                      <p
                        title={dataProvider?.institution}
                        className={styles.institution}
                      >
                        {truncate(dataProvider?.institution, 18)}
                      </p>
                    ) : (
                      ' '
                    )}
                  </>
                  {Boolean(dataProvider?.id) && (
                    <ActivitySelect>
                      {activities.routes
                        .filter((activity) => activity.parent == null)
                        // eslint-disable-next-line no-shadow
                        .map(({ path, test, children }) => (
                          <ActivitySelect.Option
                            key={path}
                            disabled={
                              globalStore.dataProvider?.issues?.harvestingStatus
                                ?.lastHarvestingDate === null &&
                              disabledTabs.includes(path)
                            }
                            value={path}
                            selected={test(pathname)}
                            dataProviderId={dataProvider.id}
                            subMenu={children}
                            showSubMenu={showSubMenuState[path] || false}
                            setShowSubMenu={() => handleShowSubMenu(path)}
                            setShowSubMenuState={setShowSubMenuState}
                            settingsRef={
                              path === 'settings' ? settingsRef : null
                            }
                          />
                        ))}
                      {/* eslint-disable-next-line max-len */}
                      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                      <div
                        className={styles.restartButton}
                        onClick={restartModal}
                      >
                        <img
                          className={styles.restartIcon}
                          alt="restart-icon"
                          src={restart}
                        />
                        <span>Start tutorial</span>
                      </div>
                    </ActivitySelect>
                  )}
                </SideBar>
              </>
            )}
            {tutorial && tutorial.currentStep === 3 && (
              <DashboardGuide
                dataProviderData={dataProvider}
                tutorial={tutorial}
                targetRef={settingsRef}
              />
            )}
            {tutorial && tutorial.currentStep === 4 && (
              <DashboardGuide
                dataProviderData={dataProvider}
                tutorial={tutorial}
                targetRef={settingsRef}
              />
            )}
          </div>
          {children && <Main>{children}</Main>}
        </Container>
        {isAuthenticated && user && dataProvider && (
          <FeedbackButton user={user} dataProvider={dataProvider} />
        )}
      </>
    )
  }
)

export default Application
