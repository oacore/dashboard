import React from 'react'

import { Container, AppBar, SideBar, Main } from '../layout'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'
import Logout from './logout'

const activities = ['overview', 'content', 'deposit-dates', 'plugins']

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
          <ActivitySelect value={activity}>
            {activities.map(value => (
              <ActivitySelect.Option
                key={value}
                value={value}
                selected={value === activity}
              />
            ))}
          </ActivitySelect>
        )}
      </SideBar>
      <Main>{children}</Main>
    </Container>
  </>
)

export default Application
