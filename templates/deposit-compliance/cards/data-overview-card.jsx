import React from 'react'

import styles from '../styles.module.css'

import { Card, Button } from 'design'
import * as texts from 'texts/depositing'
import { valueOrDefault } from 'utils/helpers'
import NumericValue from 'components/numeric-value'

const DataOverviewCard = ({ totalCount, complianceLevel }) => (
  <Card className={styles.dataOverview} tag="section">
    <Card.Title tag="h2">{texts.dataOverview.title}</Card.Title>
    <div className={styles.numbers}>
      <NumericValue
        tag="p"
        value={valueOrDefault(totalCount, 'Loading...')}
        caption="outputs counted"
      />
      {totalCount > 0 && (
        <NumericValue
          tag="p"
          value={valueOrDefault(100 - complianceLevel, 'Loading...')}
          append="%"
          caption="non-compliant"
        />
      )}
    </div>
    <Button tag="a" href="#deposit-dates-card" variant="contained">
      {texts.dataOverview.redirect}
    </Button>
  </Card>
)

export default DataOverviewCard
