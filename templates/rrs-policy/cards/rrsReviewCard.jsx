import React from 'react'
import { Icon } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import { formatNumber } from '../../../utils/helpers'
import { Button } from '../../../design'
import Actions from '../../../components/actions'

import rrs from 'texts/rrs-retention'
import { Card } from 'design'

const RrsReviewCard = ({ rrsList }) => {
  const rrsToReviewList = rrsList.filter(
    (item) => item.validationStatusRRS !== 0 && item.validationStatusRRS !== 1
  )
  return (
    <Card
      className={styles.cardWrapper}
      tag="section"
      title={rrs.reviewCard.title}
    >
      <div className={styles.headerWrapper}>
        <Card.Title className={styles.cardTitle} tag="h2">
          {rrs.reviewCard.title}
        </Card.Title>
        <Actions
          description={rrs.reviewCard.info}
          hoverIcon={
            <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
          }
        />
      </div>
      <Card.Description className={styles.cardDescription}>
        {rrs.reviewCard.description}
      </Card.Description>
      <div className={styles.innerContent}>
        <p className={styles.inputCount}>
          {formatNumber(rrsToReviewList.length)}
          <span className={styles.innerContentText}>outputs</span>
        </p>
      </div>
      <Button href="#rrsTable" variant="contained">
        {rrs.reviewCard.action}
      </Button>
    </Card>
  )
}

export default RrsReviewCard
