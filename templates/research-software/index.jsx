import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import ShowMoreText from '../../components/showMore'
import texts from '../../texts/sw/sw.yml'
import StatsCard from '../../components/statsCard/statsCard'

const SwPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => {
    const [showMore, setShowMore] = useState(false)
    const toggleShowMore = () => {
      setShowMore(!showMore)
    }

    return (
      <Tag
        className={classNames.use(styles.main).join(className)}
        {...restProps}
      >
        <DashboardHeader
          title={texts.title}
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
        <div className={styles.mainWrapper}>
          <div className={styles.cardsWrapper}>
            <StatsCard
              title={texts.statsCards.ready.title}
              description={texts.statsCards.ready.description}
              actionText={texts.statsCards.ready.action}
              showInfo={texts.statsCards.ready.tooltip}
              // loading={globalStore.dataProvider.orcidStatsLoading}
              count={54}
              wholeWidthCard
              // actionHref="#orcideTable"
              // onActionClick={() => handleStatsCardClick('with')}
            />
            <StatsCard
              title={texts.statsCards.sent.title}
              description={texts.statsCards.sent.description}
              actionText={texts.statsCards.sent.action}
              showInfo={texts.statsCards.sent.tooltip}
              noticeable={texts.statsCards.sent.noticeable}
              // loading={globalStore.dataProvider.orcidStatsLoading}
              count={31}
              wholeWidthCard
              // actionHref="#withoutOrcideTable"
              // onActionClick={() => handleStatsCardClick('without')}
              countClassName={styles.inputCount}
            />
            <StatsCard
              title={texts.statsCards.responded.title}
              actionText={texts.statsCards.responded.action}
              showInfo={texts.statsCards.responded.tooltip}
              // loading={globalStore.dataProvider.orcidStatsLoading}
              wholeWidthCard
              count={12}
              // actionHref="#otherDataTable"
              // onActionClick={() => handleStatsCardClick('other')}
            />
          </div>
        </div>
      </Tag>
    )
  }
)

export default SwPageTemplate
