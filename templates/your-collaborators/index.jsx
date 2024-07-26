import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/your-collaborators/your-collaborators.yml'
import ShowMoreText from '../../components/showMore'
import NetworkGraph from './chart'
import CollaboratorsCard from './cards/collaboratorsCard'

const tempData = {
  chart: {
    graphData: {
      nodes: [
        {
          id: 'Stark',
          height: 50,
          count: 10, // Add count property
        },
        {
          id: 'Frey',
          height: 50,
          count: 5, // Add count property
        },
        {
          id: 'Bolton',
          height: 50,
          count: 7, // Add count property
        },
        {
          id: 'Lannister',
          height: 50,
          count: 8, // Add count property
        },
        {
          id: 'Tyrell',
          height: 50,
          count: 6, // Add count property
        },
      ],
      edges: [
        {
          from: 'Stark',
          to: 'Frey',
        },
        {
          from: 'Stark',
          to: 'Bolton',
        },
        {
          from: 'Stark',
          to: 'Lannister',
        },
        {
          from: 'Stark',
          to: 'Tyrell',
        },
      ],
    },
  },
}

const YourCollaboratorsPageTemplate = observer(
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
          title={texts.network.title}
          showMore={
            <ShowMoreText
              className={styles.description}
              text={texts.network.description || 'N/A'}
              maxLetters={320}
              showMore={showMore}
              toggleShowMore={toggleShowMore}
              textRestyle
            />
          }
        />
        <div className={styles.chartWrapper}>
          <NetworkGraph data={tempData} />
        </div>
        <DashboardHeader
          title={texts.collaborators.title}
          showMore={
            <ShowMoreText
              className={styles.description}
              text={texts.collaborators.description || 'N/A'}
              maxLetters={320}
              showMore={showMore}
              toggleShowMore={toggleShowMore}
              textRestyle
            />
          }
        />
        <div className={styles.cardsWrapper}>
          <CollaboratorsCard />
        </div>
      </Tag>
    )
  }
)

export default YourCollaboratorsPageTemplate
