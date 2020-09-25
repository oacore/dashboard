import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import {
  TableCard,
  PublicationsDatesCard,
  DataOverviewCard,
  CrossRepositoryCheckRedirectCard,
  DepositTimeLagCard,
  CrossRepositoryCheckCard,
} from './cards'

import { Icon, Message, Link } from 'design'
import Title from 'components/title'
import Markdown from 'components/markdown'
import { intro as texts } from 'texts/depositing'

const SUPPORT_EMAIL_URL = 'mailto:t%68%65t%65am%40core%2e%61c%2eu%6b'
const SUPPORT_EMAIL = decodeURIComponent(
  SUPPORT_EMAIL_URL.slice('mailto:'.length)
)

const NotEnoughDataMessage = () => (
  <Message>
    <Icon src="#alert-outline" /> Your repository is not configured to expose
    information on dates of deposit in a machine-readable format. For more
    information check our{' '}
    <Link href="https://core.ac.uk/ref-audit">guidelines</Link> and contact us
    at <Link href={SUPPORT_EMAIL_URL}>{SUPPORT_EMAIL}</Link>.
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
}) => (
  <Tag className={[styles.container, className].join(' ')} {...restProps}>
    {countryCode?.toLowerCase() !== 'gb' && (
      <RegionAlert>{texts.regionWarning}</RegionAlert>
    )}
    <Title>{texts.title}</Title>
    <Markdown>{texts.body}</Markdown>
    {totalCount === 0 ? (
      <NotEnoughDataMessage />
    ) : (
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
    )}
  </Tag>
)

export default DepositComplianceTemplate
