import React from 'react'

import styles from '../styles.module.css'

import { Button, Card } from 'design'
import * as texts from 'texts/depositing'
import NumericValue from 'components/numeric-value'
import { valueOrDefault } from 'utils/helpers'

const CrossRepositoryCheckRedirectCard = ({ possibleBonusCount }) => (
  <Card
    className={styles.crossRepositoryCheckRedirect}
    tag="section"
    title={texts.crossRepositoryCheck.tooltip}
  >
    <Card.Title tag="h2">{texts.crossRepositoryCheck.title}</Card.Title>
    <NumericValue
      value={valueOrDefault(possibleBonusCount, 'Loading...')}
      caption="outputs match"
      className={styles.outputsMatch}
    />
    <Button tag="a" variant="contained" href="#cross-repository-check">
      {texts.crossRepositoryCheck.redirect}
    </Button>
  </Card>
)

export default CrossRepositoryCheckRedirectCard
