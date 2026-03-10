import { CrFeatureLayout, CrHeader, CrPaper, AccessPlaceholder, CrDateRangePicker } from '@core/core-ui';
import { TextData } from '@features/DepositCompliance/texts';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { DepositTimeLagCard } from './components/DepositTimeLagCard';
import { CrossRepositoryCheckCard } from './components/CrossRepositoryCheckCard';
import { PublicationsDatesCard } from './components/PublicationsDatesCard';
import { NotEnoughDataMessage, NotEnoughDataBasedOnDates } from './components/NotEnoughDataMessage';
import { useDepositTimeLag } from './hooks/useDepositTimeLag';
import { useCrossDepositLag } from './hooks/useCrossDepositLag';
import { usePublicationDatesValidate } from './hooks/usePublicationDatesValidate';
import { useDepositDatesStore } from './store/depositDatesStore';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import './styles.css';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { RegionAlert } from '@features/DepositCompliance/components';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import {Button, Spin} from 'antd';
import {ExclamationCircleOutlined, CheckOutlined, PlusCircleOutlined, LoadingOutlined} from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { scrollToSection } from '@utils/helpers';
import { PublicReleaseDatesTable } from './components/PublicReleaseDatesTable';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData';
import {usePublicReleaseDatesStore} from '@features/DepositCompliance/store/publicReleaseDatesStore.ts';

export const DepositComplianceFeature = () => {
  const { organisation } = useOrganisation();
  const {
    downloadCsv,
    resetOnPageEnter,
  } = usePublicReleaseDatesStore();
  const { dateRange, setDateRange, resetDateRange } = useDepositDatesStore();

  useEffect(() => {
    resetOnPageEnter();
    resetDateRange();
  }, [resetOnPageEnter, resetDateRange]);
  const { timeLagData, isLoading, error, isError } = useDepositTimeLag();
  const { crossDepositLag, crossDepositLagCsvUrl, isLoading: isCrossDepositLagLoading, error: crossDepositLagError } = useCrossDepositLag();
  const { publicationDatesValidate, error: publicationDatesError } = usePublicationDatesValidate();
  const { selectedDataProvider } = useDataProviderStore();

  const depositDatesCardRef = useRef<HTMLDivElement>(null);
  const crossRepositoryCheckRef = useRef<HTMLDivElement>(null);

  const totalCount = timeLagData.reduce((sum, item) => sum + item.worksCount, 0);
  const { isStartingPlan } = useBillingPlanData(timeLagData, organisation);
  const isRetrieveDepositDatesInProgress = isLoading || isCrossDepositLagLoading;

  const handleDateChange = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      setDateRange(startDate, endDate);
    }
  };


  const renderItem = () => {
    const defaultStartDate = '2021-01-01 00:00:00';
    const today = new Date();
    const defaultEndDate = `${today.toISOString().split('T')[0]} 00:00:00`;

    const hasCustomDateRange =
      dateRange.startDate !== defaultStartDate ||
      dateRange.endDate !== defaultEndDate;

    if(isLoading) {
      return (
        <div className="data-spinner-wrapper-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
          <p className="spinner-text">Loading...</p>
        </div>
      )
    }
    if (hasCustomDateRange && totalCount === 0) {
      return <NotEnoughDataBasedOnDates />;
    }

    if (totalCount === 0 && !isStartingPlan) {
      return <NotEnoughDataMessage />;
    }

    if (isStartingPlan) {
      return (
        <CrPaper>
          <AccessPlaceholder
            description="This feature is available only to Supporting or Sustaining members"
          />
        </CrPaper>
      );
    }


    return (
      <>
        <div className="picker-wrapper">
          <span className="date-title">Include records from</span>
          <CrDateRangePicker
            onDateChange={handleDateChange}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
          />
        </div>
        <div className="compliance-cards-wrapper">
          <CrStatsCard
            loading={isRetrieveDepositDatesInProgress}
            title={TextData.compliance.total.title}
            caption={TextData.compliance.total.subTitle}
            value={totalCount}
            error={error}
            infoText={TextData.compliance.total.description}
            showInfo
            button={
              <div className="button-wrapper">
                <Button
                  type="primary"
                  onClick={() => scrollToSection(depositDatesCardRef)}
                >
                  {TextData.compliance.total.buttons.review}
                </Button>
                <Button onClick={downloadCsv} type="text">
                  {TextData.compliance.total.buttons.download}
                </Button>
              </div>
            }
          />
          <CrStatsCard
            loading={isRetrieveDepositDatesInProgress}
            title={TextData.compliance.compliant.title}
            caption={TextData.compliance.compliant.subTitle}
            infoText={TextData.compliance.compliant.description}
            showInfo
            icon={<CheckOutlined className="tick-icon" />}
            iconClassName="green"
            subValue={totalCount - (crossDepositLag?.nonCompliantCount || 0)}
            percentageValue={
              totalCount > 0
                ? ((totalCount - (crossDepositLag?.nonCompliantCount || 0)) / totalCount) * 100
                : 0
            }
            error={crossDepositLagError}
          />
          <CrStatsCard
            loading={isRetrieveDepositDatesInProgress}
            title={TextData.compliance.nonCompliant.title}
            caption={TextData.compliance.nonCompliant.subTitle}
            infoText={TextData.compliance.nonCompliant.description}
            showInfo
            subValue={crossDepositLag?.nonCompliantCount}
            percentageValue={
              totalCount > 0
                ? ((crossDepositLag?.nonCompliantCount || 0) / totalCount) * 100
                : 0
            }
            icon={
              <ExclamationCircleOutlined className="cross-icon" />
            }
            iconClassName="red"
            error={crossDepositLagError}
          />
          <CrStatsCard
            loading={isRetrieveDepositDatesInProgress}
            title={TextData.compliance.cross.title}
            caption={TextData.compliance.cross.subTitle}
            button={
              <Button
                type="primary"
                onClick={() => scrollToSection(crossRepositoryCheckRef)}
              >
                {TextData.compliance.cross.button}
              </Button>
            }
            value={crossDepositLag?.resultCount}
            icon={<PlusCircleOutlined className="tick-icon" />}
            iconClassName="green"
            error={crossDepositLagError}
          />
        </div>
        <DepositTimeLagCard
          timeLagData={timeLagData}
          isLoading={isLoading}
          error={isError}
        />
        <div ref={crossRepositoryCheckRef} className="compliance-card-wrapper">
          <CrossRepositoryCheckCard
            crossDepositLag={crossDepositLag}
            crossDepositLagCsvUrl={crossDepositLagCsvUrl}
            error={!!crossDepositLagError}
          />
          <PublicationsDatesCard
            fullCount={publicationDatesValidate?.fullCount}
            partialCount={publicationDatesValidate?.partialCount}
            noneCount={publicationDatesValidate?.noneCount}
            error={!!publicationDatesError}
          />
        </div>
        <div ref={depositDatesCardRef} >
          <PublicReleaseDatesTable totalCount={totalCount} />
        </div>
      </>
    );
  };


  return (
    <CrFeatureLayout className="compliance-layout-wrapper">
      <CrHeader
        title={TextData.title}
        showMore={
          <CrShowMore
            text={TextData.description}
            maxLetters={320}
          />
        }
      />
      {selectedDataProvider?.location?.countryCode?.toLowerCase() !== 'gb' && (
        <RegionAlert>{TextData.regionWarning}</RegionAlert>
      )}
      {renderItem()}
    </CrFeatureLayout>
  );
};
