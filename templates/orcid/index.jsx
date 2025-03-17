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
            // await globalStore.dataProvider.getOrcidWithoutPaperData(id)
            // await globalStore.dataProvider.getOrcidOtherData(id)
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
              action={texts.statsCards.withOrcid.action}
              tooltip={texts.statsCards.withOrcid.tooltip}
              statList={globalStore.dataProvider.orcidData || []}
              statLoading={!globalStore.dataProvider.orcidData}
            />
            <StatsCard
              title={texts.statsCards.withoutOrcid.title}
              description={texts.statsCards.withoutOrcid.description}
              action={texts.statsCards.withoutOrcid.action}
              tooltip={texts.statsCards.withoutOrcid.tooltip}
              noticeable={texts.statsCards.withoutOrcid.noticeable}
              statList={globalStore.dataProvider.orcidWithoutPaperData || []}
              statLoading={!globalStore.dataProvider.orcidWithoutPaperData}
            />
            <StatsCard
              title={texts.statsCards.otherOrcid.title}
              description={texts.statsCards.otherOrcid.description}
              action={texts.statsCards.otherOrcid.action}
              tooltip={texts.statsCards.otherOrcid.tooltip}
              statList={globalStore.dataProvider.orcidOtherData || []}
              statLoading={!globalStore.dataProvider.orcidOtherData}
            />
          </div>
        </div>
        <OrcidTable
          orcidTableDataLoading={globalStore.dataProvider.orcidTableDataLoading}
          renderDropDown={globalStore.dataProvider.articleAdditionalData}
          initialLoad={initialLoad}
          tableOrcidDatas={globalStore.dataProvider.orcidData}
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
