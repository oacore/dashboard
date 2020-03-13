import React from 'react'

import { Container, AppBar, SideBar, Main } from '../layout'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'
import Logout from './logout'

import activities from 'store/activities'

const Application = ({ children, dataProvider, activity, ...restProps }) => (
  <>
    <Head />
    <Container {...restProps}>
      <AppBar>
        {dataProvider && <RepositorySelect value={dataProvider} />}
        <Logout />
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
