import React, { useContext, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import {
  CrossRepositoryCheckCard,
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
import { Button } from '../../design'
import DateRangePicker from '../../components/oaDatePicker/odDatePicker'
import { GlobalContext } from '../../store'

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

const NotEnoughDataBasedOnDates = () => (
  <Message className={styles.errorWrapper}>
    There is not enough data available for this time period to generate a
    compliance view.
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
  publicReleaseDatesError,
  dataProviderData,
  publicationDatesValidate,
  crossDepositLagCsvUrl,
  complianceLevel,
  totalCount,
  timeLagData,
  isRetrieveDepositDatesInProgress,
  isPublicReleaseDatesInProgress,
  crossDepositLag,
  countryCode,
  billingPlan,
  tag: Tag = 'main',
  ...restProps
}) => {
  const checkBillingType = billingPlan?.billingType === 'sustaining'
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    field: 'publicReleaseDate',
    direction: 'desc',
  })

  const { ...globalStore } = useContext(GlobalContext)
  const HEADER_HEIGHT = 56

  const renderItem = () => {
    const hasCustomDateRange =
      dataProviderData.depositDates?.dateRange.startDate !==
        '2021-01-01 00:00:00' ||
      dataProviderData.depositDates?.dateRange.endDate !==
        `${new Date().toISOString().split('T')[0]} 00:00:00`

    if (hasCustomDateRange && totalCount === 0)
      return <NotEnoughDataBasedOnDates />

    if (totalCount === 0 && checkBillingType) return <NotEnoughDataMessage />

    if (!checkBillingType) {
      return (
        <AccessPlaceholder
          dataProviderData={dataProviderData}
          description="This feature is available only to Sustaining members"
        />
      )
    }

    const onSearchChange = async (event) => {
      const searchTerm = event.target.value
      setLocalSearchTerm(searchTerm)
      await globalStore.dataProvider.depositDates.retrieveDepositDatesTable(
        0,
        100,
        `${sortConfig.field}:${sortConfig.direction}`,
        searchTerm,
        {
          wait: true,
          fromDate: globalStore.dataProvider.depositDates.dateRange?.startDate,
          toDate: globalStore.dataProvider.depositDates.dateRange?.endDate,
        }
      )
    }

    const handleDateChange = (startDate, endDate) => {
      if (startDate && endDate) {
        globalStore.dataProvider.depositDates.setDateRange(startDate, endDate)

        globalStore.dataProvider.depositDates.retrieveDepositDatesTable(
          0,
          100,
          `${sortConfig.field}:${sortConfig.direction}`,
          localSearchTerm,
          {
            fromDate: startDate,
            toDate: endDate,
            wait: true,
          }
        )

        dataProviderData.depositDates.updateOaiUrl(
          dataProviderData.depositDates.baseUrl,
          startDate,
          endDate
        )
      }
    }
    const handleScrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: elementPosition - HEADER_HEIGHT,
          behavior: 'smooth',
        })
      }
    }

    return (
      <>
        <div className={styles.pickerWrapper}>
          <span className={styles.dateTitle}>Include records from</span>
          <DateRangePicker
            onDateChange={handleDateChange}
            initialStartDate={
              dataProviderData.depositDates?.dateRange?.startDate?.split(
                ' '
              )[0] || ''
            }
            initialEndDate={
              dataProviderData.depositDates?.dateRange?.endDate?.split(
                ' '
              )[0] || ''
            }
          />
        </div>
        <div className={styles.complianceWrapper}>
          <ComplianceOptions
            hasTooltip
            isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
            title={compliance.compliance.total.title}
            caption={compliance.compliance.total.subTitle}
            value={totalCount}
            button={
              <div className={styles.buttonWrapper}>
                <Button
                  tag="a"
                  variant="contained"
                  href="#deposit-dates-card"
                  onClick={(e) => {
                    e.preventDefault()
                    handleScrollToSection('deposit-dates-card')
                  }}
                >
                  Review
                </Button>
                <Button tag="a" variant="text" href={datesUrl}>
                  Download
                </Button>
              </div>
            }
            description={compliance.compliance.total.description}
          />
          <ComplianceOptions
            hasTooltip
            isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
            title={compliance.compliance.compliant.title}
            caption={compliance.compliance.compliant.subTitle}
            description={compliance.compliance.compliant.description}
            icon={<img className={styles.tick} src={greenTick} alt="" />}
            className={`${styles.wrapper} ${styles.green}`}
            subValue={totalCount - crossDepositLag?.nonCompliantCount}
            percentageValue={
              ((totalCount - crossDepositLag?.nonCompliantCount) / totalCount) *
              100
            }
          />
          <ComplianceOptions
            hasTooltip
            isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
            title={compliance.compliance.nonCompliant.title}
            caption={compliance.compliance.nonCompliant.subTitle}
            description={compliance.compliance.nonCompliant.description}
            subValue={crossDepositLag?.nonCompliantCount}
            percentageValue={
              (crossDepositLag?.nonCompliantCount / totalCount) * 100
            }
            icon={
              <Icon src="#alert-circle-outline" style={{ color: '#c62828' }} />
            }
            className={`${styles.wrapper} ${styles.red}`}
          />
          <ComplianceOptions
            isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
            title={compliance.compliance.cross.title}
            caption={compliance.compliance.cross.subTitle}
            button={
              <Button
                tag="a"
                variant="contained"
                href="#cross-repository-check"
                onClick={(e) => {
                  e.preventDefault()
                  handleScrollToSection('cross-repository-check')
                }}
              >
                {compliance.compliance.cross.button}
              </Button>
            }
            value={crossDepositLag?.resultCount}
            icon={<img className={styles.tick} src={add} alt="" />}
            className={`${styles.wrapper} ${styles.green}`}
          />
        </div>
        <DepositTimeLagCard
          timeLagData={timeLagData}
          isRetrieveDepositDatesInProgress={isRetrieveDepositDatesInProgress}
        />
        <div className={styles.cardWrapper}>
          <CrossRepositoryCheckCard
            crossDepositLag={crossDepositLag}
            crossDepositLagCsvUrl={crossDepositLagCsvUrl}
          />
          <PublicationsDatesCard
            fullCount={publicationDatesValidate?.fullCount}
            partialCount={publicationDatesValidate?.partialCount}
            noneCount={publicationDatesValidate?.noneCount}
          />
        </div>
        {publicReleaseDatesPages && (
          <TableCard
            publicReleaseDatesPages={publicReleaseDatesPages}
            datesUrl={datesUrl}
            totalCount={totalCount}
            isPublicReleaseDatesInProgress={isPublicReleaseDatesInProgress}
            publicReleaseDatesError={publicReleaseDatesError}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            localSearchTerm={localSearchTerm}
            setLocalSearchTerm={setLocalSearchTerm}
            onSearchChange={onSearchChange}
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
