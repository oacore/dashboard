import React from 'react'

import { Container, AppBar, SideBar } from '../layout'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'

import { classNameHelpers } from 'design'

const activities = [
  'overview',
  'data',
  'deposit-dates',
  'statistics',
  'plugins',
  'settings',
]

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
              <ActivitySelect.Option value={value} />
            ))}
          </ActivitySelect>
        )}
      </SideBar>

      {children}
    </Container>
  </>
)

export default Application
