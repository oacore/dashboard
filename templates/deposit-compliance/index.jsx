import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import {
  CrossRepositoryCheckCard,
  CrossRepositoryCheckRedirectCard,
  DataOverviewCard,
  DepositTimeLagCard,
  PublicationsDatesCard,
  TableCard,
} from './cards'
import AccessPlaceholder from '../../components/access-placeholder/AccessPlaceholder'
import DashboardHeader from '../../components/dashboard-header'
import RouteGuard from '../../utils/allowedRouteGuards'

import { Icon, Link, Message } from 'design'
import { intro as texts } from 'texts/depositing'

const NotEnoughDataMessage = () => (
  <Message className={styles.errorWrapper}>
    <Icon className={styles.errorIcon} src="#alert-outline" /> Check our{' '}
    <Link href="https://core.ac.uk/ref-audit">guidelines</Link> and enable the
    required support and then notify us once ready, so that we can initiate
    collecting this information from your repository.
  </Message>
)

const RegionAlert = ({
  className,
  children: message,
  tag: Tag = 'p',
  ...htmlProps
}) => (
  <Tag className={classNames.use(styles.alert).join(className)} {...htmlProps}>
    <Icon src="#alert-outline" /> {message}
  </Tag>
)

const DepositComplianceTemplate = ({
  className,
  datesUrl,
  publicReleaseDatesPages,
  dataProviderData,
  publicationDatesValidate,
  crossDepositLagCsvUrl,
  complianceLevel,
  totalCount,
  timeLagData,
  isRetrieveDepositDatesInProgress,
  crossDepositLag,
  countryCode,
  billingPlan,
  tag: Tag = 'main',
  ...restProps
}) => {
  const checkBillingType = billingPlan?.billingType === 'sustaining'

  const renderItem = () => {
    if (totalCount === 0 && checkBillingType) return <NotEnoughDataMessage />
    if (!checkBillingType) {
      return (
        <AccessPlaceholder
          dataProviderData={dataProviderData}
          description="This feature is available only to Sustaining members"
        />
      )
    }
    return (
      <>
        <DataOverviewCard
          totalCount={totalCount}
          complianceLevel={complianceLevel}
        />
        <CrossRepositoryCheckRedirectCard
          possibleBonusCount={crossDepositLag?.possibleBonusCount}
          error={crossDepositLag?.error}
        />
        <DepositTimeLagCard
          timeLagData={timeLagData}
          isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
        />
        <CrossRepositoryCheckCard
          crossDepositLag={crossDepositLag}
          crossDepositLagCsvUrl={crossDepositLagCsvUrl}
        />

        <PublicationsDatesCard
          fullCount={publicationDatesValidate?.fullCount}
          partialCount={publicationDatesValidate?.partialCount}
          noneCount={publicationDatesValidate?.noneCount}
        />
        {publicReleaseDatesPages && (
          <TableCard
            publicReleaseDatesPages={publicReleaseDatesPages}
            datesUrl={datesUrl}
          />
        )}
      </>
    )
  }

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <DashboardHeader title={texts.title} description={texts.body} />
      {countryCode?.toLowerCase() !== 'gb' && (
        <RegionAlert>{texts.regionWarning}</RegionAlert>
      )}
      {renderItem()}
    </Tag>
  )
}

export default RouteGuard(DepositComplianceTemplate)
