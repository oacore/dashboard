import React from 'react'

import { Container, AppBar, SideBar } from '../layout'
import RepositorySelect from './repository-select'
import Navigation, { captions as navigationCaptions } from './navigation'
import Head from './head'
// TODO: Use generic route after proper directory tree adjustment
import Route from './next-route'

import { classNameHelpers } from 'design'

const dataProvider = 1
const activities = [
  'overview',
  'data',
  'deposit-dates',
  'statistics',
  'plugins',
  'settings',
]

const Application = ({ children, ...restProps }) => (
  <>
    <Head />
    <Container {...restProps}>
      <AppBar>
        <RepositorySelect />
      </AppBar>

      <SideBar tag="nav">
        <h2 className={classNameHelpers.srOnly}>Navigate your data</h2>
        <Navigation>
          {activities.map(value => (
            <Navigation.Item href={new Route(dataProvider, value)}>
              {navigationCaptions[value]}
            </Navigation.Item>
          ))}
        </Navigation>
      </SideBar>

      {children}
    </Container>
  </>
)

export default Application
