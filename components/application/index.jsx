import React, { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { DataProviderLogo } from '@oacore/design/lib/elements'

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

const Application = observer(
  ({
    children,
    dataProvider,
    pathname,
    variant = 'public', // 'public' or 'internal'
    isAuthenticated = false,
    acceptedTCVersion = 0,
    tutorial,
    ...restProps
  }) => {
    const headerRef = useRef(null)
    const siderRef = useRef(null)
    const [redirect, setRedirect] = useState(false)

    const restartModal = () => {
      setRedirect(true)
      if (localStorage.getItem('onboardingDone') !== null) {
        localStorage.removeItem('onboardingDone')
        tutorial.currentStep = 1
        tutorial.openModal()
      }
    }

    useEffect(() => {
      if (redirect)
        window.location.pathname = `/data-providers/${dataProvider.id}/overview`
    }, [redirect, dataProvider])

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
