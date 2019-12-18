import React from 'react'

import { Container, AppBar, SideBar } from '../layout'
import RepositorySelect from './repository-select'
import ActivitySelect from './activity-select'

const Application = ({ children, ...restProps }) => (
  <>
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
