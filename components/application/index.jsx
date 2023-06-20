import React, { useRef, useState, useEffect } from 'react'
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
import restart from '../upload/assets/restart.svg'
import notification from '../../templates/settings/assets/bell.svg'
import NotificationPopUp from '../../templates/settings/cards/notificationPopUp'
import { useNotification } from './useNotification'

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
    const headerRef = useRef(null)
    const siderRef = useRef(null)
    const [redirect, setRedirect] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const router = useRouter()
    const { notifications, refetch } = useNotification(userID)
    const handleShowNotification = () => {
      setShowNotification(!showNotification)
    }

    const closeNotification = () => {
      setShowNotification(false)
    }

    const handleNotificationClick = async (id, notificationId) => {
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

        await refetch(userID)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }
    const restartModal = () => {
      setRedirect(true)
      if (localStorage.getItem('onboardingDone') !== null) {
        localStorage.removeItem('onboardingDone')
        tutorial.currentStep = 1
        tutorial.openModal()
      }
    }

    useEffect(() => {
      if (redirect) {
        router.push(`/data-providers/${dataProvider.id}/overview`)
        setRedirect(false)
      }
    }, [redirect, dataProvider])

    const displayedNotifications = notifications?.slice(0, 10)

    const unseenNotification = displayedNotifications.filter(
      (item) => !item.notificationRead.readStatus
    )

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
          <div ref={headerRef}>
            <AppBar>
              {isAuthenticated ? (
                <>
                  <>
                    {dataProvider?.logo ? (
                      <DataProviderLogo
                        size="sm"
                        className={styles.repositoryLogo}
                        imageSrc={dataProvider?.logo}
                        alt={dataProvider.name}
                      />
                    ) : (
                      <img
                        className={styles.repositoryLogoDefault}
                        src={imagePlaceholder}
                        alt=""
                      />
                    )}
                    {dataProvider && <RepositorySelect value={dataProvider} />}
                    <div className={styles.bellWrapper}>
                      {/* eslint-disable-next-line max-len */}
                      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */}
                      <img
                        onClick={handleShowNotification}
                        src={notification}
                        alt="bell"
                      />

                      <div className={styles.count}>
                        {unseenNotification.length}
                      </div>
                    </div>
                    <Logout />
                  </>
                </>
              ) : null}
            </AppBar>
            {tutorial && tutorial.currentStep === 2 && (
              <DashboardGuide
                dataProviderData={dataProvider}
                refElement={headerRef.current}
                tutorial={tutorial}
                placement="bottom"
              />
            )}
            {showNotification && (
              <NotificationPopUp
                handleNotificationClick={handleNotificationClick}
                displayedNotifications={displayedNotifications}
                userID={userID}
                closeNotification={closeNotification}
                seeAllNotifications={seeAllNotifications}
                user={user}
              />
            )}
          </div>
          <div ref={siderRef}>
            {variant === 'internal' && (
              <>
                <SideBar tag="nav">
                  <h2 className="sr-only">Navigate your data</h2>
                  {Boolean(dataProvider?.id) && (
                    <ActivitySelect>
                      {activities.routes
                        .filter((activity) => activity.parent == null)
                        .map(({ path, test }) => (
                          <ActivitySelect.Option
                            key={path}
                            value={path}
                            selected={test(pathname)}
                            dataProviderId={dataProvider.id}
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
                refElement={siderRef.current}
                tutorial={tutorial}
                placement="left"
              />
            )}
            {tutorial && tutorial.currentStep === 4 && (
              <DashboardGuide
                dataProviderData={dataProvider}
                refElement={siderRef.current}
                tutorial={tutorial}
                placement="left"
              />
            )}
          </div>
          {children && <Main>{children}</Main>}
        </Container>
      </>
    )
  }
)

export default Application
