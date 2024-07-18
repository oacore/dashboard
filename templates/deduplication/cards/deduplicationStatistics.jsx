import React from 'react'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import Actions from '../../../components/actions'
import ExportButton from '../../../components/export-button'
import { formatNumber } from '../../../utils/helpers'

import { ProgressSpinner, Card } from 'design'

const DeduplicationStatistics = ({
  duplicateList,
  duplicatesUrl,
  checkBillingType,
}) => (
  <Card
    className={styles.deduplicationStatisticsWrapper}
    tag="section"
    title={texts.info.title}
  >
    <div className={styles.numberHeaderWrapper}>
      <Card.Title className={styles.cardTitle} tag="h2">
        {texts.info.countTitle}
      </Card.Title>
      <Actions
        className={styles.actionItem}
        description={texts.info.info}
        hoverIcon={
          <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
        }
      />
    </div>
    <div className={styles.innerWrapper}>
      <span className={styles.innerSubTitle}>{texts.info.subTitle}</span>
      {duplicateList.count !== undefined && duplicateList.count !== null ? (
        <span className={styles.text}>{formatNumber(duplicateList.count)}</span>
      ) : (
        <div className={styles.spinnerWrapper}>
          <ProgressSpinner className={styles.spinner} />
          <p className={styles.spinnerText}>
            This may take a while, longer for larger repositories ...
          </p>
        </div>
      )}
      {!checkBillingType && (
        <ExportButton
          href={duplicatesUrl}
          className={styles.footerButton}
          variant="contained"
        >
          {texts.info.action}
        </ExportButton>
      )}
    </div>
  </Card>
)

export default DeduplicationStatistics
