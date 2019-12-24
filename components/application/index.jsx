import React from 'react'

import { Container, AppBar, SideBar, Main } from '../layout'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'

import { classNameHelpers } from 'design'

const activities = ['overview', 'content', 'deposit-dates']

const Application = ({ children, dataProvider, activity, ...restProps }) => (
  <>
    <Head />
    <Container {...restProps}>
      <AppBar>
        <RepositorySelect value={dataProvider} />
      </AppBar>

      <SideBar tag="nav">
        <h2 className={classNameHelpers.srOnly}>Navigate your data</h2>
        {dataProvider && (
          <ActivitySelect value={activity}>
            {activities.map(value => (
              <ActivitySelect.Option
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
