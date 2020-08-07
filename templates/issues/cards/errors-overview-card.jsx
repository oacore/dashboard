import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import NumericValue from 'components/numeric-value'
import { valueOrDefault } from 'utils/helpers'
import texts from 'texts/issues'

const ErrorsOverviewCard = ({ totalCount, errorsCount }) => (
  <Card
    className={styles.errorsOverview}
    tag="section"
    title={texts.issuesOverviewCardTooltip}
  >
    <Card.Title tag="h2">Issues overview</Card.Title>
    <div className={styles.numbers}>
      <NumericValue
        value={valueOrDefault(totalCount, 'Loading...')}
        caption="documents affected"
        tag="p"
      />
      <NumericValue
        className={classNames.use(errorsCount && styles.errorsCount)}
        value={valueOrDefault(errorsCount, 'Loading...')}
        caption="with errors"
        tag="p"
      />
    </div>
  </Card>
)
export default ErrorsOverviewCard
