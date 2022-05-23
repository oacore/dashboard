import { useCallback, useEffect, useState } from 'react'

import texts from 'texts/issues'

const useTypes = (aggregations, initialType) => {
  const [transformedList, setTransformedList] = useState([])
  const [issueList, setIssueList] = useState([])
  const [activeType, setActiveType] = useState(initialType)

  useEffect(() => {
    const defaultIssuesList = Object.entries(aggregations?.countByType ?? {})
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({
        ...texts.messages[type],
        actualType: type,
        title: texts.messages[type]?.title || type,
        outputsAffectedCount: count,
      }))

    defaultIssuesList.sort((a, b) => {
      if (a.severity === b.severity) return a.type.localeCompare(b.type)

      const severityMap = {
        ERROR: 2,
        WARNING: 1,
        DEBUG: 3,
      }

      return severityMap[a.severity] - severityMap[b.severity]
    })
    setTransformedList(defaultIssuesList)
    setIssueList(defaultIssuesList)
  }, [aggregations])

  const onChangeIssueList = useCallback(
    (actionName) => {
      setActiveType(actionName)

      if (actionName === 'All') {
        setIssueList(transformedList)
        return
      }
      const list = transformedList.filter(
        (item) => item.severity === actionName
      )
      setIssueList(list)
    },
    [activeType, issueList]
  )

  return {
    issueList,
    onChangeIssueList,
    activeType,
  }
}
export default useTypes
