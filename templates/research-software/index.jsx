import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import ShowMoreText from '../../components/showMore'
import text from '../../texts/sw/sw.yml'

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
          title={text.title}
          showMore={
            <ShowMoreText
              className={styles.description}
              text={text.description || 'N/A'}
              maxLetters={320}
              showMore={showMore}
              toggleShowMore={toggleShowMore}
              textRestyle
            />
          }
        />
        hi
      </Tag>
    )
  }
)

export default SwPageTemplate
