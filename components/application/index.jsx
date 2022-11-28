import React from 'react'
import { observer } from 'mobx-react-lite'
import { DataProviderLogo } from '@oacore/design/lib/elements'

import { Container, AppBar, SideBar, Main } from '../layout'
import activities from './activities'
import LoadingBar from './loading-bar'
import TermsConditionPopup from './terms-condition'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'
import Logout from './logout'
import styles from './styles.module.css'

const Application = observer(
  ({
    children,
    dataProvider,
    pathname,
    variant = 'public', // 'public' or 'internal'
    isAuthenticated = false,
    // eslint-disable-next-line no-unused-vars
    acceptedTCVersion = 0,
    ...restProps
  }) => (
    <>
      <Head />
      {isAuthenticated ? <TermsConditionPopup acceptedTCVersion /> : null}
      <Container variant={variant} {...restProps}>
        <LoadingBar fixed />
        <AppBar>
          {isAuthenticated ? (
            <>
              {!!dataProvider?.logo && (
                <DataProviderLogo
                  size="sm"
                  className={styles.repositoryLogo}
                  imageSrc={dataProvider?.logo}
                  alt={dataProvider.name}
                />
              )}
              {dataProvider && <RepositorySelect value={dataProvider} />}
              <Logout />
            </>
          ) : null}
        </AppBar>
        {variant === 'internal' && (
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
              </ActivitySelect>
            )}
          </SideBar>
        )}
        {children && <Main>{children}</Main>}
      </Container>
    </>
  )
)

export default Application
