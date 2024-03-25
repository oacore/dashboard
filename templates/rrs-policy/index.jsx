import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import Markdown from '../../components/markdown'
import RrsStatsCard from './cards/rrsStatsCard'
import RrsReviewCard from './cards/rrsReviewCard'
import RrsCheckCard from './cards/rrsCheckerCard'
import RrsTable from './tables/rrsTable'

import rrs from 'texts/rrs-retention'

const RrsPageTemplate = ({
  tag: Tag = 'main',
  className,
  rrsList,
  getRrslistData,
  updateRrsStatus,
  statusUpdate,
  rrsAdditionalData,
  getOutputsAdditionalData,
  rrsAdditionalDataLoading,
  rrsPdfLoading,
  uploadPdf,
  uploadResults,
  rrsUrl,
  metadataCount,
  ...restProps
}) => (
  <Tag
    className={classNames.use(styles.rrsMainWrapper).join(className)}
    {...restProps}
  >
    <header className={styles.header}>
      <div className={styles.validatorHeader}>
        <div className={styles.temporaryWrapper}>
          <h1 className={styles.title}>{rrs.title}</h1>
        </div>
      </div>
      <Markdown className={styles.description}>{rrs.description}</Markdown>
    </header>
    <div className={styles.cardsWrapper}>
      <RrsStatsCard
        rrsUrl={rrsUrl}
        rrsList={rrsList}
        metadataCount={metadataCount}
      />
      <RrsReviewCard rrsList={rrsList} />
      <RrsCheckCard
        rrsPdfLoading={rrsPdfLoading}
        uploadPdf={uploadPdf}
        uploadResults={uploadResults}
      />
    </div>
    <RrsTable
      rrsList={rrsList}
      getRrslistData={getRrslistData}
      updateRrsStatus={updateRrsStatus}
      statusUpdate={statusUpdate}
      rrsAdditionalData={rrsAdditionalData}
      getOutputsAdditionalData={getOutputsAdditionalData}
      rrsAdditionalDataLoading={rrsAdditionalDataLoading}
      rrsUrl={rrsUrl}
    />
  </Tag>
)

export default RrsPageTemplate
