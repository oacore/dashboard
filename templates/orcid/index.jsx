import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import texts from '../../texts/orcid/orcid.yml'
import ShowMoreText from '../../components/showMore'
import DashboardHeader from '../../components/dashboard-header'
import StatsCard from '../../components/statsCard/statsCard'

import orcid from 'texts/orcid'

const OrcidPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => {
    const [showMore, setShowMore] = useState(false)

    const toggleShowMore = () => {
      setShowMore(!showMore)
    }

    const statsCardsArray = Object.values(orcid.statsCards)

    return (
      <Tag
        className={classNames.use(styles.main).join(className)}
        {...restProps}
      >
        <DashboardHeader
          title={texts.title}
          identifier="BETA"
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
            {statsCardsArray.map((card) => (
              <StatsCard
                key={card.title}
                title={card.title}
                description={card.description}
                action={card.action}
                tooltip={card.tooltip}
                noticeable={card.noticeable}
                statUrl="test"
                statList="test"
                statLoading={false}
              />
            ))}
          </div>
        </div>
      </Tag>
    )
  }
)
export default OrcidPageTemplate
