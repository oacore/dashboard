import React from 'react'

import styles from '../styles.module.css'
import { formatNumber } from '../../../utils/helpers'
import LinkButton from '../../../components/link-button'

import { ProgressSpinner, Card } from 'design'

const StatisticsCards = ({ dataCount, text, href, dataProviderId }) => (
  <Card
    className={styles.statisticsWrapper}
    tag="section"
    title={text.statsCard.title}
  >
    <Card.Title className={styles.cardTitle} tag="h2">
      {text.statsCard.title}
    </Card.Title>
    <div className={styles.innerWrapper}>
      <span className={styles.statisticsDescription}>
        {text.statsCard.description}
      </span>
      <div className={styles.statisticsFooter}>
        {dataCount !== undefined && dataCount !== null ? (
          <span className={styles.statisticsCount}>
            {formatNumber(dataCount)}
          </span>
        ) : (
          <div className={styles.spinnerWrapper}>
            <ProgressSpinner className={styles.spinner} />
            <p className={styles.spinnerText}>
              This may take a while, longer for larger repositories ...
            </p>
          </div>
        )}
        <LinkButton
          href={href}
          dataProviderId={dataProviderId}
          className={styles.footerButton}
          variant="contained"
        >
          {text.statsCard.subAction}
        </LinkButton>
      </div>
    </div>
  </Card>
)

export default StatisticsCards
