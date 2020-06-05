import { useCallback, useReducer } from 'react'

const dataStateReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_DATA_STATE':
      return { ...state, ...(action.value || {}) }
    default:
      throw new Error('Wrong action type for dataStateReducer')
  }
}

const useDynamicTableData = ({ pages, defaultSize = 100 }) => {
  const [dataState, changeDataState] = useReducer(dataStateReducer, {
    data: null,
    size: defaultSize,
    isLastPageLoaded: false,
    totalLength: null,
  })

  const fetchData = useCallback(
    async ({
      next = false,
      force = false,
      columnOrder,
      searchTerm,
      selectedOption: type,
    } = {}) => {
      let newSize = dataState.size

      if (next) newSize += 100
      else newSize = defaultSize

      const newState = {}

      // reset data when search or column order changes
      if (searchTerm !== pages.searchTerm || columnOrder !== pages.columnOrder)
        newState.data = null

      if (force) {
        pages.reset({
          columnOrder,
          searchTerm,
          type,
        })

        newState.isLastPageLoaded = false
      }

      newState.isLoading = true

      changeDataState({
        type: 'CHANGE_DATA_STATE',
        value: newState,
      })

      const newData = await pages.slice(0, newSize)

      changeDataState({
        type: 'CHANGE_DATA_STATE',
        value: {
          isLoading: false,
          data: newData,
          size: newSize,
          isLastPageLoaded: pages.isLastPageLoaded,
          totalLength: pages.totalLength,
        },
      })
    },
    [dataState.size]
  )
  return [dataState, fetchData]
}

export default useDynamicTableData
