import React from 'react'
import { Icon } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import { rrs } from '../../../texts/rrs-retention'
import Actions from '../../../components/actions'

import { Card } from 'design'

const RrsCheckCard = () => (
  <Card
    className={styles.cardWrapperBig}
    tag="section"
    title={rrs.checkCard.title}
  >
    <div className={styles.headerWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {rrs.checkCard.title}
      </Card.Title>
      <Actions
        description={rrs.checkCard.info}
        hoverIcon={
          <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
        }
      />
    </div>
  </Card>
)

export default RrsCheckCard
