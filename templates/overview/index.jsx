import React, { useEffect, useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

import styles from './styles.module.css'
import { DataStatisticsCard, DoiCard, DepositingCard, IrusCard } from './cards'
import RioxxCard from './cards/rioxx-card'
import DashboardGuide from '../../components/dashboard-tutorial/dashboardGuide'
import NotificationGuide from '../settings/cards/notificationGuide'

const OverviewTemplate = observer(
  ({
    metadataCount,
    metadatadaHistory,
    fullTextCount,
    timeLagData,
    isTimeLagDataLoading,
    complianceLevel,
    doiCount,
    doiDownloadUrl,
    doiEnrichmentSize,
    dataProviderId,
    dataProviderName,
    dataProviderInstitution,
    countryCode,
    harvestingDate,
    errorCount,
    warningCount,
    viewStatistics,
    rioxxCompliance,
    className,
    dataProviderData,
    tag: Tag = 'main',
    tutorial,
    notificationGuide,
    updateNotifications,
    organisationId,
    ...restProps
  }) => {
    const router = useRouter()
    const [shouldRender, setShouldRender] = useState(false)
    const [hasNotificationGuideBeenShown, setNotificationGuideShown] = useState(
      localStorage.getItem('notificationGuideShown') === 'true'
    )

    const handleButtonClick = async () => {
      setNotificationGuideShown(true)
      localStorage.setItem('notificationGuideShown', 'true')
      await Promise.all([
        updateNotifications(
          {
            organisationId,
            type: 'harvest-completed',
            datetimeInterval: 'every month',
          },
          'harvest-completed'
        ),
        // updateNotifications(
        //   {
        //     organisationId,
        //     type: 'deduplication-completed',
        //     datetimeInterval: 'every month',
        //   },
        //   'deduplication-completed'
        // ),
      ])
      notificationGuide.closeModal()
    }

    const handleButtonClose = async () => {
      setNotificationGuideShown(true)
      localStorage.setItem('notificationGuideShown', 'true')
      router.push(`/data-providers/${dataProviderData.id}/notifications`)
      notificationGuide.closeModal()
    }

    useEffect(() => {
      if (hasNotificationGuideBeenShown) notificationGuide.closeModal()
    }, [hasNotificationGuideBeenShown])

    useEffect(() => {
      const t = localStorage.getItem('onboardingDone')
      setShouldRender(t === 'true')
    }, [shouldRender])

    const modal = useRef(null)
    const { pathname } = window.location

    useEffect(() => {
      if (
        pathname === `/data-providers/${dataProviderData.id}/overview` &&
        !shouldRender
      )
        tutorial.openModal()
    }, [pathname])

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
        {...restProps}
      >
        <DataStatisticsCard
          metadatadaHistory={metadatadaHistory}
          metadataCount={metadataCount}
          fullTextCount={fullTextCount}
          harvestingDate={harvestingDate}
          errorCount={errorCount}
          warningCount={warningCount}
          dataProviderId={dataProviderId}
          viewStatistics={viewStatistics}
        />
        {tutorial && tutorial.currentStep === 1 && (
          <DashboardGuide
            tutorial={tutorial}
            dataProviderData={dataProviderData}
            modal={modal}
          />
        )}
        {!hasNotificationGuideBeenShown && (
          <NotificationGuide
            dataProviderData={dataProviderData}
            notificationGuide={notificationGuide}
            handleButtonClick={handleButtonClick}
            handleButtonClose={handleButtonClose}
          />
        )}
        <DepositingCard
          chartData={timeLagData}
          complianceLevel={complianceLevel}
          dataProviderId={dataProviderId}
          countryCode={countryCode}
        />

        {rioxxCompliance != null && rioxxCompliance.totalCount > 0 && (
          <RioxxCard compliance={rioxxCompliance} />
        )}
        {viewStatistics != null && <IrusCard statistics={viewStatistics} />}
        {doiCount && (
          <DoiCard
            outputsCount={metadataCount}
            doiCount={doiCount}
            downloadUrl={doiDownloadUrl}
            enrichmentSize={doiEnrichmentSize}
            dataProviderId={dataProviderId}
          />
        )}
      </Tag>
    )
  }
)

export default OverviewTemplate
