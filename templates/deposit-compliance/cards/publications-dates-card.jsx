import React from 'react'

import * as texts from 'texts/depositing'
import { Card } from 'design'
import StackedVerticalBarChart from 'components/stacked-vertical-bar-chart'

const PublicationsDatesCard = ({ fullCount, partialCount, noneCount }) => {
  const isLoading = [fullCount, partialCount, noneCount].some(
    (el) => el == null
  )
  const data = [
    {
      value: fullCount,
      caption: texts.publicationDates.matching,
      background: 'var(--success)',
    },
    {
      value: partialCount,
      caption: texts.publicationDates.incorrect,
      background: 'var(--warning)',
    },
    {
      value: noneCount,
      caption: texts.publicationDates.different,
      background: 'var(--danger)',
      color: 'var(--white)',
    },
  ].filter((el) => el.value > 0)

  return (
    <Card tag="section">
      <Card.Title tag="h2">{texts.publicationDates.title}</Card.Title>
      <Card.Description>{texts.publicationDates.description}</Card.Description>
      {isLoading && <p>Loading data</p>}
      {!isLoading && !data.length && <p>No data found</p>}
      {!isLoading && data.length > 0 && <StackedVerticalBarChart data={data} />}
    </Card>
  )
}

export default PublicationsDatesCard
