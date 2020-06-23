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

import { Icon } from 'design'
import Title from 'components/title'
import Markdown from 'components/markdown'
import { intro as texts } from 'texts/depositing'

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
    <TableCard
      publicReleaseDatesPages={publicReleaseDatesPages}
      datesUrl={datesUrl}
    />
  </Tag>
)

export default DepositComplianceTemplate
