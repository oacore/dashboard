import React, { useContext, useEffect, useRef, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

import styles from './styles.module.css'
import { DataStatisticsCard, DoiCard, DepositingCard, IrusCard } from './cards'
import RioxxCard from './cards/rioxx-card'
import DashboardGuide from '../../components/dashboard-tutorial/dashboardGuide'
import NotificationGuide from '../settings/cards/notificationGuide'
import { GlobalContext } from '../../store'
import placeholder from '../../components/upload/assets/placeholderChart.svg'
import { Button } from '../../design'
import SdgCard from './cards/sdg-card'

import { Card } from 'design'

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
    const { ...globalStore } = useContext(GlobalContext)

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
        updateNotifications(
          {
            organisationId,
            type: 'deduplication-completed',
            datetimeInterval: 'every month',
          },
          'deduplication-completed'
        ),
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
        {globalStore.dataProvider?.issues?.harvestingStatus
          ?.lastHarvestingDate !== null ? (
          <>
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
            {countryCode?.toLowerCase() === 'gb' && (
              <DepositingCard
                chartData={timeLagData}
                complianceLevel={complianceLevel}
                dataProviderId={dataProviderId}
                countryCode={countryCode}
              />
            )}

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
          </>
        ) : (
          <Card className={styles.placeholderCard}>
            <Card.Title tag="h2">General information</Card.Title>
            <div className={styles.innerContent}>
              <img
                src={placeholder}
                alt="placeholder"
                className={styles.logo}
              />
              <h5 className={styles.placeholderTitle}>
                You repository is still indexing.
              </h5>
              <p className={styles.placeholderDescription}>
                This can take up to 3 weeks depending on the size of the data
                provider and our workload. You will receive an email once this
                has been done. In the meantime, find out more about how to
                ensure your repository is indexed to maximum effect in the Data
                Provider’s Guide.
              </p>
              <Button
                className={styles.actionButton}
                variant="contained"
                tag="div"
                onClick={() =>
                  window.open(
                    'https://core.ac.uk/documentation/membership-documentation',
                    '_blank'
                  )
                }
              >
                Data Provider’s Guide
              </Button>
            </div>
          </Card>
        )}
        <SdgCard />
      </Tag>
    )
  }
)

export default OverviewTemplate
