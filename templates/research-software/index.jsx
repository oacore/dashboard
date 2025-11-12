import React, { useContext, useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'
import { Button } from '@oacore/design'

import styles from './styles.module.css'
import texts from '../../texts/sw/sw.yml'
import StatsCard from '../../components/statsCard/statsCard'
import DashboardSettingsHeader from '../../components/dashboard-settings-header'
import { Icon, TextField } from '../../design'
import { GlobalContext } from '../../store'
import SwTable from './tables/swTables'
import Markdown from '../../components/markdown'
import NotificationToggler from './components/settings'
// import DateRangePicker from '../../components/oaDatePicker/odDatePicker'

const SwPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => {
    const [initialLoad, setInitialLoad] = useState(true)
    const [activeButton, setActiveButton] = useState('ready')
    const [localSearchTerm, setLocalSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [hasError, setHasError] = useState(false)
    const [isDescriptionVisible, setDescriptionVisible] = useState(false)
    const { ...globalStore } = useContext(GlobalContext)

    const toggleDescription = () => {
      setDescriptionVisible(!isDescriptionVisible)
    }

    useEffect(() => {
      const fetchSwData = async () => {
        if (globalStore?.dataProvider?.id) {
          const { id } = globalStore.dataProvider
          try {
            setHasError(false)
            await globalStore.dataProvider.getReadySwData(id, '')
            setInitialLoad(false)
          } catch (error) {
            console.error('Error fetching Sw data:', error)
            setHasError(true)
            setInitialLoad(false)
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

    //  TODO will need change after we know props we accept
    const onSearchChange = async (event) => {
      const searchTerm = event.target.value
      setLocalSearchTerm(searchTerm)

      const startDate = globalStore.dataProvider?.dateRange?.startDate
      const endDate = globalStore.dataProvider?.dateRange?.endDate

      try {
        setHasError(false)
        await globalStore.dataProvider.getReadySwData(
          globalStore?.dataProvider?.id,
          searchTerm,
          startDate,
          endDate
        )
      } catch (error) {
        setHasError(true)
      }
    }

    //  TODO will need change after we know props we accept
    const fetchData = async () => {
      if (
        globalStore.dataProvider.readySwTableDataLoading ||
        globalStore.dataProvider.swData.groups?.ready_for_validation?.length ===
          globalStore.dataProvider.swData.groups?.ready_for_validation.length
      )
        return

      const from = (page + 1) * 50
      const size = 50

      try {
        setHasError(false)
        await globalStore.dataProvider.getReadySwData(
          globalStore.dataProvider.id,
          localSearchTerm,
          from,
          size
        )
        setPage((prevPage) => prevPage + 1)
      } catch (error) {
        console.error('Error fetching additional data:', error)
        setHasError(true)
      }
    }

    //  TODO will need change after we know props we accept  TODO removed temp
    // const handleDateChange = (startDate, endDate) => {
    //   if (startDate && endDate) {
    //     globalStore.dataProvider.setDateRange(startDate, endDate)
    //
    //     globalStore.dataProvider.getReadySwData(
    //       globalStore.dataProvider.id,
    //       localSearchTerm,
    //       startDate,
    //       endDate
    //     )
    //   }
    // }

    return (
      <Tag
        className={classNames.use(styles.main).join(className)}
        {...restProps}
      >
        <DashboardSettingsHeader
          title={texts.title}
          description={texts.description}
          isDescriptionVisible={isDescriptionVisible}
          toggleDescription={toggleDescription}
        >
          <h2>{texts.settings.title}</h2>
          <div
            className={classNames.use(
              styles.settingsDescriptionWrapper,
              styles.settingsDescriptionSmall
            )}
          >
            <Icon src="#alert" className={styles.cardIconWarning} />
            <div className={styles.settingsDescriptionTextWrapper}>
              <Markdown className={styles.settingsDescriptionText}>
                {texts.settings.warning}
              </Markdown>
            </div>
          </div>
          <div className={styles.settingsWrapper}>
            <span className={styles.headerSubTitle}>
              {texts.settings.configure.title}
            </span>
            <TextField
              id="notification"
              type="text"
              name="Notification endpoint"
              label="Notification endpoint"
              placeholder="https://yourepository.url/endpoint"
              disabled
              value="https://yourepository.url/endpoint"
              className={styles.notificationInput}
            />
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
        <div className={styles.pickerWrapper}>
          <span className={styles.dateTitle}>{texts.calendar.title}</span>
          {/* TODO removed temp */}
          {/* <DateRangePicker */}
          {/*  onDateChange={handleDateChange} */}
          {/*  initialStartDate={ */}
          {/* eslint-disable-next-line max-len */}
          {/*    globalStore.dataProvider?.dateRange?.startDate?.split(' ')[0] || */}
          {/*    '' */}
          {/*  } */}
          {/*  initialEndDate={ */}
          {/* eslint-disable-next-line max-len */}
          {/*    globalStore.dataProvider?.dateRange?.endDate?.split(' ')[0] || '' */}
          {/*  } */}
          {/* /> */}
        </div>
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
                    <div className={styles.settingsDescriptionText}>
                      Your repository is not configured to support the automatic
                      notification of software mentions, please go to{' '}
                      <Button
                        className={styles.clickAction}
                        variant="text"
                        onClick={toggleDescription}
                      >
                        Settings
                      </Button>{' '}
                      to activate it.
                    </div>
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
                    <div className={styles.settingsDescriptionText}>
                      Your repository is not configured to support the automatic
                      notification of software mentions, please go to{' '}
                      <Button
                        className={styles.clickAction}
                        variant="text"
                        onClick={toggleDescription}
                      >
                        Settings
                      </Button>{' '}
                      to activate it.
                    </div>
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
          localSearchTerm={localSearchTerm}
          fetchData={fetchData}
          onSearchChange={onSearchChange}
          hasError={hasError}
        />
      </Tag>
    )
  }
)

export default SwPageTemplate
