import React, { useContext, useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'
import { Link } from '@oacore/design'

import styles from './styles.module.css'
import texts from '../../texts/sw/sw.yml'
import StatsCard from '../../components/statsCard/statsCard'
import DashboardSettingsHeader from '../../components/dashboard-settings-header'
import { Icon } from '../../design'
import { GlobalContext } from '../../store'
import SwTable from './tables/swTables'
import Markdown from '../../components/markdown'
import NotificationToggler from './components/settings'

const SwPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => {
    const [initialLoad, setInitialLoad] = useState(true)
    const [activeButton, setActiveButton] = useState('ready')
    const { ...globalStore } = useContext(GlobalContext)

    useEffect(() => {
      const fetchSwData = async () => {
        if (globalStore?.dataProvider?.id) {
          const { id } = globalStore.dataProvider
          try {
            await globalStore.dataProvider.getReadySwData(id, '')
            setInitialLoad(false)
          } catch (error) {
            console.error('Error fetching Sw data:', error)
          }
        }
      }

      fetchSwData()
    }, [globalStore?.dataProvider?.id])

    const handleStatsCardClick = (tab) => {
      setActiveButton(tab)
      const tableSection = document.getElementById('readySwTable')
      if (tableSection) tableSection.scrollIntoView({ behavior: 'smooth' })
    }

    return (
      <Tag
        className={classNames.use(styles.main).join(className)}
        {...restProps}
      >
        <DashboardSettingsHeader
          title={texts.title}
          description={texts.description}
        >
          <h2>{texts.settings.title}</h2>
          <div className={styles.settingsDescriptionWrapper}>
            <Icon src="#alert" className={styles.cardIconWarning} />
            <div className={styles.settingsDescriptionTextWrapper}>
              <p className={styles.settingsDescriptionText}>
                {texts.settings.warning}
              </p>
              <Link href="https://yourepository.url/endpoint">
                https://yourepository.url/endpoint
              </Link>
            </div>
          </div>
          <div className={styles.settingsWrapper}>
            <span className={styles.headerSubTitle}>
              {texts.settings.configure.title}
            </span>
            <NotificationToggler
              type="sw"
              label={
                <span className={styles.switchTitle}>
                  {texts.settings.configure.description}
                </span>
              }
              title={texts.settings.configure.subDescription}
              options={Object.values(texts.settings.configure.option)}
              // checked={deduplicationSwitch}
              // onChange={toggleDeduplicationSwitch}
              id="sw"
              name="sw"
              // handleOptionChange={handleDeduplicationOptionChange}
              // dataProviderId={dataProviderId}
              // notifications={deduplicationNotifications}
              // updateNotificationsPending={deduplicationNotificationsPending}
              // notificationsPending={deduplicationNotificationsPending}
            />
          </div>
        </DashboardSettingsHeader>
        <div className={styles.mainWrapper}>
          <div className={styles.cardsWrapper}>
            <StatsCard
              title={texts.statsCards.ready.title}
              description={texts.statsCards.ready.description}
              actionText={texts.statsCards.ready.action}
              showInfo
              infoText={texts.statsCards.ready.tooltip}
              loading={initialLoad}
              count={
                globalStore.dataProvider.swData.counts?.ready_for_validation
              }
              wholeWidthCard
              actionHref="#readySwTable"
              onActionClick={() => handleStatsCardClick('ready')}
            />
            <StatsCard
              title={texts.statsCards.sent.title}
              description={texts.statsCards.sent.description}
              actionText={texts.statsCards.sent.action}
              showInfo
              infoText={texts.statsCards.sent.tooltip}
              noticeable={texts.statsCards.sent.noticeable}
              loading={initialLoad}
              count={globalStore.dataProvider.swData.counts?.sent}
              wholeWidthCard
              actionHref="#sendSwTable"
              onActionClick={() => handleStatsCardClick('sent')}
              countClassName={styles.inputCount}
              tempDisabled={
                <div className={styles.settingsDescriptionWrapper}>
                  <Icon src="#alert" className={styles.cardIconWarning} />
                  <div className={styles.settingsDescriptionTextWrapper}>
                    <Markdown className={styles.settingsDescriptionText}>
                      {texts.statsCards.sent.disabled}
                    </Markdown>
                  </div>
                </div>
              }
            />
            <StatsCard
              title={texts.statsCards.responded.title}
              actionText={texts.statsCards.responded.action}
              showInfo
              infoText={texts.statsCards.responded.tooltip}
              loading={initialLoad}
              wholeWidthCard
              count={globalStore.dataProvider.swData.counts?.responded}
              actionHref="#respondSwTable"
              onActionClick={() => handleStatsCardClick('responded')}
              tempDisabled={
                <div className={styles.settingsDescriptionWrapper}>
                  <Icon src="#alert" className={styles.cardIconWarning} />
                  <div className={styles.settingsDescriptionTextWrapper}>
                    <Markdown className={styles.settingsDescriptionText}>
                      {texts.statsCards.responded.disabled}
                    </Markdown>
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <SwTable
          swTableDataLoading={globalStore.dataProvider.readySwTableDataLoading}
          initialLoad={initialLoad}
          tableSwData={globalStore.dataProvider.swData}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </Tag>
    )
  }
)

export default SwPageTemplate
