import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import RrsStatsCard from './cards/rrsStatsCard'
import RrsReviewCard from './cards/rrsReviewCard'
import RrsCheckCard from './cards/rrsCheckerCard'
import RrsTable from './tables/rrsTable'
import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/deduplication/deduplication.yml'
import ShowMoreText from '../../components/showMore'

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
  rrsDataLoading,
  ...restProps
}) => {
  const [showMore, setShowMore] = useState(false)
  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  return (
    <Tag className={classNames.use(styles.main).join(className)} {...restProps}>
      <DashboardHeader
        title={rrs.title}
        showMore={
          <ShowMoreText
            className={styles.description}
            text={texts.description || 'N/A'}
            maxLetters={320}
            showMore={showMore}
            toggleShowMore={toggleShowMore}
            textRestyle
          />
        }
      />
      <div className={styles.rrsMainWrapper}>
        <div className={styles.cardsWrapper}>
          <RrsStatsCard
            rrsUrl={rrsUrl}
            rrsList={rrsList}
            metadataCount={metadataCount}
            rrsDataLoading={rrsDataLoading}
          />
          <RrsReviewCard rrsList={rrsList} rrsDataLoading={rrsDataLoading} />
          <RrsCheckCard
            rrsPdfLoading={rrsPdfLoading}
            uploadPdf={uploadPdf}
            uploadResults={uploadResults}
          />
        </div>
        <RrsTable
          rrsDataLoading={rrsDataLoading}
          rrsList={rrsList}
          getRrslistData={getRrslistData}
          updateRrsStatus={updateRrsStatus}
          statusUpdate={statusUpdate}
          rrsAdditionalData={rrsAdditionalData}
          getOutputsAdditionalData={getOutputsAdditionalData}
          rrsAdditionalDataLoading={rrsAdditionalDataLoading}
          rrsUrl={rrsUrl}
        />
      </div>
    </Tag>
  )
}

export default RrsPageTemplate
