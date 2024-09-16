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
import ComplianceOptions from './cards/compliance-option'
import compliance from '../../texts/depositing/compliance.yml'
import greenTick from '../../components/upload/assets/greenTick.svg'
import add from '../../components/upload/assets/add.svg'

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
        <div className={styles.complianceWrapper}>
          <ComplianceOptions
            title={compliance.compliance.total.title}
            caption={compliance.compliance.total.subTitle}
            value={totalCount}
            button={compliance.compliance.total.button}
            description={compliance.compliance.total.description}
          />
          <ComplianceOptions
            title={compliance.compliance.compliant.title}
            caption={compliance.compliance.compliant.subTitle}
            button={compliance.compliance.compliant.button}
            description={compliance.compliance.compliant.description}
            icon={<img className={styles.tick} src={greenTick} alt="" />}
            className={`${styles.wrapper} ${styles.green}`}
          />
          <ComplianceOptions
            title={compliance.compliance.cross.title}
            caption={compliance.compliance.cross.subTitle}
            button={compliance.compliance.cross.button}
            description={compliance.compliance.cross.description}
            icon={
              <Icon src="#alert-circle-outline" style={{ color: '#c62828' }} />
            }
            className={`${styles.wrapper} ${styles.red}`}
          />
          <ComplianceOptions
            title={compliance.compliance.nonCompliant.title}
            caption={compliance.compliance.nonCompliant.subTitle}
            button={compliance.compliance.nonCompliant.button}
            description={compliance.compliance.nonCompliant.description}
            icon={
              <Icon src="#alert-circle-outline" style={{ color: '#666' }} />
            }
            className={`${styles.wrapper} ${styles.dark}`}
          />
          <ComplianceOptions
            title={compliance.compliance.unknown.title}
            caption={compliance.compliance.unknown.subTitle}
            button={compliance.compliance.unknown.button}
            description={compliance.compliance.unknown.description}
            icon={<img className={styles.add} src={add} alt="" />}
            className={`${styles.wrapper} ${styles.green}`}
          />
        </div>
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

export default DepositComplianceTemplate
