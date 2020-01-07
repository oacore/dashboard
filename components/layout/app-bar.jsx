import React, { useContext } from 'react'
import { AppBar } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import LayoutContext from './context'
import styles from './styles.css'
import RepositorySelect from '../application/repository-select'

import { AppBarToggle, Logo } from 'design'

const DashboardAppBar = ({ dataProvider, className, ...restProps }) => {
  const [state, dispatch] = useContext(LayoutContext)

  return (
    <AppBar
      className={classNames
        .use('appBar', state.repositorySelectOpen && 'appBarOpen')
        .from(styles)}
      fixed
      {...restProps}
    >
      <AppBarToggle
        className={styles.appBarToggle}
        type="button"
        aria-haspopup="true"
        aria-controls={state.sidebarId}
        aria-expanded={state.sidebarOpen}
        onClick={() => dispatch({ type: 'toggle_sidebar' })}
      />

      <AppBar.Brand className={styles.appBarBrand} href="/">
        <Logo />
      </AppBar.Brand>

      <RepositorySelect
        value={dataProvider}
        onSuggestionsToggle={value =>
          dispatch({ type: 'toggle_repository_select', value })
        }
      />
    </AppBar>
  )
}

export default DashboardAppBar
