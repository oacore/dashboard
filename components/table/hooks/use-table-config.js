import React, { useMemo } from 'react'

import Column from '../column'
import Sidebar from '../sidebar'
import Action from '../action'

const useTableConfig = (children) =>
  // recompute value only if children changes.
  useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    const columns = childrenArray.filter(
      (child) =>
        child.type === Column ||
        Object.prototype.isPrototypeOf.call(Column, child.type)
    )

    const columnOrder = Object.fromEntries(
      columns.map((column) => {
        const { id, order = null } = column.props
        return [id, order]
      })
    )

    return {
      sidebar: childrenArray.find((item) => item.type === Sidebar),
      action: childrenArray.find((item) => item.type === Action),
      columnOrder,
      columns,
    }
  }, [children])

export default useTableConfig
