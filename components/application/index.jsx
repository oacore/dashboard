import React from 'react'

import { Container, AppBar, SideBar, Main } from '../layout'
import LoadingBar from './loading-bar'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'
import Logout from './logout'
import styles from './styles.module.css'

import activities from 'store/activities'

const Application = ({
  children,
  dataProvider,
  activity,
  isAuthenticated = false,
  ...restProps
}) => (
  <>
    <Head />
    <Container {...restProps}>
      <LoadingBar className={styles.loadingBar} />
      <AppBar variant={isAuthenticated ? 'internal' : 'public'}>
        {isAuthenticated ? (
          <>
            {dataProvider && <RepositorySelect value={dataProvider} />}
            <Logout />
          </>
        ) : null}
      </AppBar>
      <SideBar tag="nav">
        <h2 className="sr-only">Navigate your data</h2>
        {dataProvider && (
          <ActivitySelect>
            {activities.map(({ id, path }) => (
              <ActivitySelect.Option
                dataProvider={dataProvider.id}
                key={id}
                value={id}
                selected={id === activity.split('/')[0]}
                path={path}
              />
            ))}
          </ActivitySelect>
        )}
      </SideBar>
      {children && <Main>{children}</Main>}
    </Container>
  </>
)

export default Application
