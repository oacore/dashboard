import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../deduplication/styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/fresh-finds/fresh-finds.yml'
import FreshFindsTable from './tables/freshFindsTable'
import ShowMoreText from '../../components/showMore'

const FreshFindsPageTemplate = observer(
  ({
    getFreshFindsData,
    freshFindsData,
    freshFindsDataLoading,
    tag: Tag = 'main',
    className,
    ...restProps
  }) => {
    const [showMore, setShowMore] = useState(false)
    const toggleShowMore = () => {
      setShowMore(!showMore)
    }

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
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
        <FreshFindsTable
          freshFindsData={freshFindsData}
          getFreshFindsData={getFreshFindsData}
          freshFindsDataLoading={freshFindsDataLoading}
        />
      </Tag>
    )
  }
)

export default FreshFindsPageTemplate
