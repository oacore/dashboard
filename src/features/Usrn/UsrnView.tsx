import { Alert, Button } from 'antd';
import { ExclamationCircleFilled, FileTextFilled } from '@ant-design/icons';
import { UsrnCard } from '@features/Usrn/components/UsrnCard';
import { articleTemplateData } from './texts';
import { useRioxxStats } from '@features/Validator/hooks/useRioxxStats';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useDataProviderStatistics } from '@/hooks/useDataProviderStatistics';
import { useUsrnData } from './hooks/useUsrnData';
import { useDoiStatistics } from '@features/Doi/hooks/useDoiStatistics';
import { useIrusStats } from '@/hooks/useIrusStats';
import { formatReportDate } from './utils/formatReportDate';
import './style.css';
import { CrHeader, CrPaper, CrFeatureLayout } from '@core/core-ui';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';

// SHOW which part has issues
const ERROR_SECTION_LABELS = {
  usrn: 'USRN data',
  rioxx: 'Rioxx stats',
  statistics: 'Data provider statistics',
  doi: 'DOI statistics',
  irus: 'IRUS stats',
} as const;

const buildErrorMessage = (failedSections: string[]): string => {
  const sectionsText = failedSections.join(', ');
  return `Failed to load: ${sectionsText}. Some information may be incomplete. Please refresh the page to try again.`;
};

export const UsrnViewPage = () => {
  const { selectedDataProvider, selectedSetSpec, statistics, doiStatistics } = useDataProviderStore();
  const rorId = selectedDataProvider?.rorData?.rorId ?? null;
  const { rioxx, error: rioxxError } = useRioxxStats(selectedDataProvider?.id);
  const { usrnData, error: usrnError } = useUsrnData(selectedDataProvider?.id);
  const { irus, error: irusError } = useIrusStats(selectedDataProvider?.id);

  const { error: statisticsError } = useDataProviderStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);
  const { error: doiError } = useDoiStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);

  const failedSections: string[] = [];
  if (usrnError) failedSections.push(ERROR_SECTION_LABELS.usrn);
  if (rioxxError) failedSections.push(ERROR_SECTION_LABELS.rioxx);
  if (statisticsError) failedSections.push(ERROR_SECTION_LABELS.statistics);
  if (doiError) failedSections.push(ERROR_SECTION_LABELS.doi);
  if (irusError) failedSections.push(ERROR_SECTION_LABELS.irus);

  const hasError = failedSections.length > 0;
  const errorMessage = buildErrorMessage(failedSections);

  const lastUpdateDate = formatReportDate(usrnData?.dateReportUpdate);

  const {
    summaryTitle,
    summaryText,
    lastUpdateLabel,
    reportTitle,
    reportTextPrefix,
    reportLinkText,
    reportLinkUrl,
    reportTextSuffix,
    ctaToolkit,
    ctaLink,
    ctaDownloadPdf,
    usrnItems = [],
  } = articleTemplateData;

  const configParams = {
    rioxx: rioxx ?? undefined,
    statistics: statistics ?? undefined,
    internalStatistics: statistics != null || doiStatistics != null
      ? {
        fullTextCount: statistics?.countFulltext,
        metadataCount: statistics?.countMetadata,
        doiCount: doiStatistics?.dataProviderDoiCount,
      }
      : undefined,
    usrn: usrnData ?? null,
    irus,
    rorId,
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <CrFeatureLayout className="page-support--wraper">
      <CrHeader
        title={summaryTitle}
        showMore={
          <CrShowMore
            text={summaryText}
            maxLetters={320}
          />
        }
      />

      {hasError && (
        <Alert
          type="error"
          showIcon
          icon={<ExclamationCircleFilled />}
          title="Data loading error"
          description={errorMessage}
          className="page-support__error-alert"
          role="alert"
          aria-live="polite"
        />
      )}

      <CrPaper className="cr-paper-spacer">
        <div className="page-support__header">
          <span className="page-support__meta">
            {lastUpdateLabel}&nbsp;
            <strong>{lastUpdateDate}</strong>
          </span>
          <div className="page-support__actions">
            <Button
              type="primary"
              className="page-support__button page-support__button--primary"
              aria-label={ctaDownloadPdf}
              onClick={handleDownloadPDF}
            >
              {ctaDownloadPdf}
            </Button>
          </div>
        </div>
        <div className="page-inner-wrraper">
          <div className="page-support__body">
            <h1 className="page-support__report-title">{reportTitle}</h1>
            <p className="page-support__report-text">
              {reportTextPrefix}&nbsp;
              <a href={reportLinkUrl} className="page-support__link">
                {reportLinkText}
              </a>
              &nbsp;{reportTextSuffix}
            </p>
            <a className="page-support__cta" href={ctaLink} aria-label={ctaToolkit} target="_blank" rel="noreferrer">
              <FileTextFilled className="page-support__cta-icon" />
              <span>{ctaToolkit}</span>
            </a>
            <div className="page-support__date">{lastUpdateDate}</div>
          </div>
          <div className="section-divider" />
          {usrnItems.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <div className="section-divider" />}
              <UsrnCard item={item} configParams={configParams} />
            </div>
          ))}
        </div>
      </CrPaper>
    </CrFeatureLayout>
  );
};
