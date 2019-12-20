import React from 'react'

import { Container, AppBar, SideBar } from '../layout'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'
import Head from './head'

const Application = ({ children, ...restProps }) => (
  <>
    <Head />
    <Container {...restProps}>
      <AppBar>
        <RepositorySelect />
      </AppBar>

      <SideBar>
        <h2>Navigate your data</h2>
        <ActivitySelect />
      </SideBar>

      {children}
    </Container>
  </>
)

export default Application
