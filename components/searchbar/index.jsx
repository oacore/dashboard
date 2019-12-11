import React from 'react'

import searchbarClassNames from './index.css'

const SearchBar = () => {
  return (
    <div className={searchbarClassNames.searchbar}>
      <input
        type="text"
        value="Open Research Online - The Open University"
        placeholder="Search..."
      />
    </div>
  )
}

export default SearchBar
