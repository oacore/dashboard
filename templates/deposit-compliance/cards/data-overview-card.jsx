import React from 'react'

import styles from '../styles.module.css'

import { Card, Button } from 'design'
import * as texts from 'texts/depositing'
import { valueOrDefault } from 'utils/helpers'
import NumericValue from 'components/numeric-value'

const getComplianceLevelNumberProps = (complianceLevel) => {
  if (complianceLevel === null || complianceLevel > 0) {
    return {
      value: valueOrDefault(100 - complianceLevel, 'Loading...'),
      append: '%',
      caption: 'non-compliant',
    }
  }

  return {
    value: 100 - complianceLevel,
    append: '',
    caption: 'outputs are non-compliant',
  }
}

const DataOverviewCard = ({ totalCount, complianceLevel }) => (
  <Card className={styles.dataOverview} tag="section">
    <Card.Title tag="h2">{texts.dataOverview.title}</Card.Title>
    <div className={styles.numbers}>
      <NumericValue
        tag="p"
        value={valueOrDefault(totalCount, 'Loading...')}
        caption="outputs counted"
      />
      <NumericValue
        tag="p"
        {...getComplianceLevelNumberProps(complianceLevel)}
      />
    </div>
    <Button tag="a" href="#deposit-dates-card" variant="contained">
      {texts.dataOverview.redirect}
    </Button>
  </Card>
)

export default DataOverviewCard
