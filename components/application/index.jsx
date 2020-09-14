import React from 'react'

import { Container, AppBar, SideBar, Main } from '../layout'
import activities from './activities'
import LoadingBar from './loading-bar'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'
import Logout from './logout'

const Application = ({
  children,
  dataProvider,
  pathname,
  variant = 'public', // 'public' or 'internal'
  isAuthenticated = false,
  ...restProps
}) => (
  <>
    <Head />
    <Container variant={variant} {...restProps}>
      <LoadingBar fixed />
      <AppBar>
        {isAuthenticated ? (
          <>
            {dataProvider && <RepositorySelect value={dataProvider} />}
            <Logout />
          </>
        ) : null}
      </AppBar>
      {variant === 'internal' && (
        <SideBar tag="nav">
          <h2 className="sr-only">Navigate your data</h2>
          {dataProvider && (
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

export default Application
