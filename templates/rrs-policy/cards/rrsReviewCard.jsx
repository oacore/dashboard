import React, { useContext } from 'react'
import { Icon } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import { formatNumber } from '../../../utils/helpers'
import { Button } from '../../../design'
import Actions from '../../../components/actions'
import { GlobalContext } from '../../../store'
import checked from '../../../components/upload/assets/checkGreen.svg'
import TextWithTooltip from '../../../components/textWithTooltip/textWithtooltip'

import rrs from 'texts/rrs-retention'
import { Card } from 'design'

const RrsReviewCard = ({ rrsList, rrsDataLoading }) => {
  const { ...globalStore } = useContext(GlobalContext)
  const rrsToReviewList = rrsList.filter(
    (item) => item.validationStatusRRS !== 1 && item.validationStatusRRS !== 2
  )
  return (
    <Card
      className={styles.cardWrapper}
      tag="section"
      title={rrs.reviewCard.title}
    >
      <div>
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
      </div>
      <div>
        {rrsDataLoading ? (
          <div className={styles.loadingContainerOutputs}>
            <div className={styles.loadingStroke} />
          </div>
        ) : (
          <div className={styles.innerContent}>
            <p className={styles.inputCount}>
              {formatNumber(rrsToReviewList.length)}
            </p>
          </div>
        )}
      </div>
      <div className={styles.footerWrapper}>
        <Button href="#rrsTable" variant="contained">
          {rrs.reviewCard.action}
        </Button>
        {globalStore?.setSelectedItem && (
          <div>
            <img src={checked} alt="" />
            <span className={styles.setName}>
              <TextWithTooltip
                className={styles.setName}
                text={globalStore.selectedSetName}
              />
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default RrsReviewCard
