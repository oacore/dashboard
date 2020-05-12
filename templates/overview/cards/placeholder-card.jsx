import React from 'react'

import OverviewCard from './overview-card'
import styles from '../styles.module.css'

import { Card, Overlay } from 'design'
import PerformanceChart from 'components/performance-chart'
import LinkButton from 'components/link-button'

const PlaceholderCard = ({ title, value, description }) => (
  <OverviewCard>
    <Card.Title tag="h2">{title}</Card.Title>
    <PerformanceChart className={styles.chart} value={value} caption={title} />
    <p>{description}</p>
    <LinkButton className={styles.linkButton}>Browse</LinkButton>
    <Overlay blur>
      <b>Coming soon</b>
    </Overlay>
  </OverviewCard>
)

export default PlaceholderCard
