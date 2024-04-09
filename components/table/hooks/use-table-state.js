import { useCallback, useReducer, useRef } from 'react'

import useDebouncedEffect from 'utils/hooks/use-debounced-effect'

const getNextOrder = (order) => {
  if (order === 'asc') return 'desc'
  if (order === 'desc') return 'asc'
  return 'asc'
}

const changeOrder = ({ id, columnOrder }) => {
  if (columnOrder[id] == null) return columnOrder

  return Object.fromEntries(
    Object.entries(columnOrder).map(([currId, currOrder]) => {
      if (currId === id) return [currId, getNextOrder(currOrder)]
      if (currOrder == null) return [currId, null]
      return [currId, 'any']
    })
  )
}

const tableStateReducer = (state, action) => {
  switch (action.type) {
    case 'CLOSE_SIDEBAR':
      return { ...state, expandedRowId: null }
    case 'CLOSE_DETAILS':
      return { ...state, expandedRowId: null }
    case 'CHANGE_SELECTED_OPTION':
      return { ...state, selectedOption: action.value }
    case 'SEARCH_CHANGED':
      return { ...state, searchTerm: action.value }
    case 'CHANGE_TABLE_STATE':
      return { ...state, ...(action.value || {}) }
    case 'CHANGE_COLUMN_ORDER':
      return {
        ...state,
        columnOrder: changeOrder({
          id: action.value,
          columnOrder: state.columnOrder,
        }),
      }
    default:
      throw new Error('Invalid action type for Table')
  }
}

const useTableState = ({ fetchDataProp, data, defaultRowClick, ...rest }) => {
  const tableRowClickTimeout = useRef(null)
  const [state, changeState] = useReducer(tableStateReducer, {
    searchTerm: '',
    expandedRowId: null,
    selectedOption: '',
    ...rest,
  })

  // Event handlers
  const handleSidebarClose = useCallback(
    () => changeState({ type: 'CLOSE_SIDEBAR' }),
    []
  )

  const handleDetailsClose = useCallback(
    () => changeState({ type: 'CLOSE_DETAILS' }),
    []
  )

  const handleRowClick = useCallback(
    (event) => {
      if (event.detail === 1) {
        const clickedRow = event.target.closest('tr')
        const rowId = !Number.isNaN(+clickedRow?.dataset.id)
          ? +clickedRow?.dataset.id
          : clickedRow?.dataset.id
        tableRowClickTimeout.current = setTimeout(() => {
          // ignore copy event
          const selection = window.getSelection().toString()
          if (selection.length) return

          if (defaultRowClick && rowId) defaultRowClick(rowId)
          changeState({
            type: 'CHANGE_TABLE_STATE',
            value: {
              expandedRowId: data?.find((e) => e.id === rowId),
            },
          })
        }, 200)
      }
    },
    [data]
  )

  const handleRowToggle = useCallback(
    (event) => {
      if (state.expandedRowId !== null) {
        handleDetailsClose()
        return
      }

      handleRowClick(event)
    },
    [state.expandedRowId]
  )

  const handleDoubleRowClick = useCallback(() => {
    // Don't expand row on double click. Let user to copy value
    clearTimeout(tableRowClickTimeout.current)
  }, [])

  const handleSelectedOption = useCallback(
    (value) =>
      changeState({
        type: 'CHANGE_SELECTED_OPTION',
        value,
      }),
    []
  )

  const handleColumnOrderChange = useCallback(
    (value) =>
      changeState({
        type: 'CHANGE_COLUMN_ORDER',
        value,
      }),
    []
  )

  const handleSearchChange = useCallback(
    ({ target: { value } }) =>
      changeState({
        type: 'SEARCH_CHANGED',
        value,
      }),
    []
  )

  const { columnOrder, searchTerm, selectedOption } = state

  const fetchData = (arg) =>
    fetchDataProp({ ...arg, columnOrder, searchTerm, selectedOption })

  useDebouncedEffect(() => {
    fetchData({ force: true })
  }, [searchTerm, selectedOption, columnOrder])

  return [
    state,
    {
      handleSidebarClose,
      handleDetailsClose,
      handleRowClick,
      handleRowToggle,
      handleDoubleRowClick,
      handleSelectedOption,
      handleColumnOrderChange,
      handleSearchChange,
      fetchData,
    },
  ]
}

export default useTableState
