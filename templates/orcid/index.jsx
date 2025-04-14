import React, { useContext, useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import texts from '../../texts/orcid/orcid.yml'
import ShowMoreText from '../../components/showMore'
import DashboardHeader from '../../components/dashboard-header'
import StatsCard from '../../components/statsCard/statsCard'
import OrcidTable from './tables/orchideTable'
import { GlobalContext } from '../../store'

const OrcidPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => {
    const [showMore, setShowMore] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)
    const { ...globalStore } = useContext(GlobalContext)

    useEffect(() => {
      const fetchOrcidData = async () => {
        if (globalStore?.dataProvider?.id) {
          const { id } = globalStore.dataProvider
          try {
            await globalStore.dataProvider.getOrcidData(id, '', 0, 50)
            await globalStore.dataProvider.getOrcidStats(id)
            await globalStore.dataProvider.getOrcidWithoutPaperData(id)
            await globalStore.dataProvider.getOrcidOtherData(id)
            setInitialLoad(false)
          } catch (error) {
            console.error('Error fetching ORCID data:', error)
          }
        }
      }

      fetchOrcidData()
    }, [globalStore?.dataProvider?.id])

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
            <StatsCard
              title={texts.statsCards.withOrcid.title}
              description={texts.statsCards.withOrcid.description}
              actionText={texts.statsCards.withOrcid.action}
              showInfo={texts.statsCards.withOrcid.tooltip}
              loading={globalStore.dataProvider.orcidStatsLoading}
              count={globalStore.dataProvider.orcidStatData.basic}
              wholeWidthCard
              actionHref="#orcideTable"
            />
            <StatsCard
              title={texts.statsCards.withoutOrcid.title}
              description={texts.statsCards.withoutOrcid.description}
              actionText={texts.statsCards.withoutOrcid.action}
              showInfo={texts.statsCards.withoutOrcid.tooltip}
              noticeable={texts.statsCards.withoutOrcid.noticeable}
              loading={globalStore.dataProvider.orcidStatsLoading}
              count={
                globalStore.dataProvider?.statistics?.countMetadata -
                globalStore.dataProvider.orcidStatData.basic
              }
              wholeWidthCard
              actionHref="#withoutOrcideTable"
            />
            <StatsCard
              title={texts.statsCards.otherOrcid.title}
              description={texts.statsCards.otherOrcid.description}
              actionText={texts.statsCards.otherOrcid.action}
              showInfo={texts.statsCards.otherOrcid.tooltip}
              loading={globalStore.dataProvider.orcidStatsLoading}
              wholeWidthCard
              count={
                globalStore.dataProvider.orcidStatData.fromOtherRepositories
              }
              actionHref="#otherDataTable"
            />
          </div>
        </div>
        <OrcidTable
          orcidTableDataLoading={globalStore.dataProvider.orcidTableDataLoading}
          withoutOrcidTableDataLoading={
            globalStore.dataProvider.withoutOrcidTableDataLoading
          }
          orcidOtherTableDataLoading={
            globalStore.dataProvider.orcidOtherTableDataLoading
          }
          renderDropDown={globalStore.dataProvider.articleAdditionalData}
          initialLoad={initialLoad}
          tableOrcidData={globalStore.dataProvider.orcidData}
          tableOrcidWithoutPaperData={
            globalStore.dataProvider.orcidWithoutPaperData
          }
          tableOrcidOtherData={globalStore.dataProvider.orcidOtherData}
          articleAdditionalDataLoading={
            globalStore.dataProvider.articleAdditionalDataLoading
          }
          articleData={globalStore.dataProvider.articleAdditionalData}
        />
      </Tag>
    )
  }
)

export default OrcidPageTemplate
