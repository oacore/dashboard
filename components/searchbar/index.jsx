import React from 'react'

import searchbarClassNames from './index.css'

const SearchBar = () => {
  return (
    <div className={searchbarClassNames.searchbar}>
      <input
        type="text"
        className={searchbarClassNames.searchbarInput}
        placeholder="Search..."
      />
    </div>
  )
}

export default SearchBar
