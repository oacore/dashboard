import React from 'react'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'

import * as texts from 'texts/depositing'
import { Card } from 'design'
import StackedVerticalBarChart from 'components/stacked-vertical-bar-chart'

const PublicationsDatesCard = ({
  fullCount = 0,
  partialCount = 0,
  noneCount = 0,
}) => {
  const isLoading = [fullCount, partialCount, noneCount].every(
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
    <Card tag="section" className={styles.chartCardWrapper}>
      <div className={styles.cardHeaderWrapper}>
        <div>
          <Card.Title tag="h2">{texts.publicationDates.title}</Card.Title>
          <Card.Description className={styles.cardDescription}>
            {texts.publicationDates.description}
          </Card.Description>
        </div>
        <Actions
          className={styles.actionItem}
          description={texts.publicationDates.tooltip}
          hoverIcon={
            <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
          }
        />
      </div>
      {isLoading && <p>Loading data</p>}
      {!isLoading && !data.length && <p>Loading data</p>}
      {!isLoading && data.length > 0 && <StackedVerticalBarChart data={data} />}
    </Card>
  )
}

export default PublicationsDatesCard
