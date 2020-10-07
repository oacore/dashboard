import React from 'react'

import IssueCard from './issue'

import texts from 'texts/issues'

const IssuesListCard = ({ aggregation, issuesByType }) => {
  const issueList = Object.entries(aggregation?.countByType ?? {})
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      ...texts.messages[type],
      actualType: type,
      title: texts.messages[type]?.title || type,
      outputsAffectedCount: count,
    }))

  issueList.sort((a, b) => {
    if (a.severity === b.severity) return a.type.localeCompare(b.type)

    const severityMap = {
      ERROR: 2,
      WARNING: 1,
      DEBUG: 3,
    }

    return severityMap[a.severity] - severityMap[b.severity]
  })

  return (
    <>
      <h2>Browse issues</h2>
      {issueList.map(
        ({ actualType, title, description, outputsAffectedCount }) => (
          <IssueCard
            key={actualType}
            title={title}
            description={description}
            count={outputsAffectedCount}
            issuesList={issuesByType.get(actualType)}
          />
        )
      )}
    </>
  )
}

export default IssuesListCard
