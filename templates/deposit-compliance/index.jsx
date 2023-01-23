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
import placeholderImg from '../../components/upload/assets/introMembership.svg'

import { Button, Icon, Link, Message } from 'design'
import Title from 'components/title'
import Markdown from 'components/markdown'
import { intro as texts } from 'texts/depositing'

const SUPPORT_EMAIL_URL = 'mailto:t%68%65t%65am%40core%2e%61c%2eu%6b'
const SUPPORT_EMAIL = decodeURIComponent(
  SUPPORT_EMAIL_URL.slice('mailto:'.length)
)

const NotEnoughDataMessage = () => (
  <Message className={styles.errorWrapper}>
    <Icon className={styles.errorIcon} src="#alert-outline" /> Your repository
    is not configured to expose information on dates of deposit in a
    machine-readable format. For more information check our{' '}
    <Link href="https://core.ac.uk/ref-audit">guidelines</Link> and contact us
    at <Link href={SUPPORT_EMAIL_URL}>{SUPPORT_EMAIL}</Link>.
  </Message>
)

const FeaturePlaceholder = ({ dataProviderData }) => (
  <div className={styles.placeholderWrapper}>
    <img src={placeholderImg} alt="" />
    <div className={styles.placeholderText}>
      This feature is available only for Sustaining member
    </div>
    <Button
      className={styles.upgradeBtn}
      variant="contained"
      href={`/data-providers/${dataProviderData.id}/membership`}
    >
      Upgrade
    </Button>
  </div>
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
  tag: Tag = 'main',
  ...restProps
}) => {
  function checkType(providerId) {
    return dataProviderData?.allMembers?.members?.find((item) => {
      if (Array.isArray(item.repo_id))
        return item.repo_id.includes(providerId.toString())
      return +item.repo_id === providerId
    })
  }

  const memberType = checkType(dataProviderData.id)

  const checkBillingType = memberType?.billing_type === 'sustaining'

  const renderItem = () => {
    if (totalCount === 0) return <NotEnoughDataMessage />
    if (!checkBillingType)
      return <FeaturePlaceholder dataProviderData={dataProviderData} />
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
      <header className={styles.headerWrapper}>
        <Title>{texts.title}</Title>
        <Markdown className={styles.introBody}>{texts.body}</Markdown>
      </header>
      {countryCode?.toLowerCase() !== 'gb' && (
        <RegionAlert>{texts.regionWarning}</RegionAlert>
      )}
      {renderItem()}
    </Tag>
  )
}

export default DepositComplianceTemplate
