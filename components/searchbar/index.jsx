import React from 'react'
import { AppBarItem } from '@oacore/design'

// import searchbarClassNames from './index.css'

const SearchBar = passProps => (
  <AppBarItem {...passProps}>
    <input
      type="text"
      value="Open Research Online - The Open University"
      placeholder="Search..."
    />
  </AppBarItem>
)

export default SearchBar
