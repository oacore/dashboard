import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, Button, Spin, Steps, Tooltip } from 'antd';
import { CheckOutlined, LoadingOutlined, ExclamationCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import type { HarvestingStatus } from '../types';
import HarvestingModal from './HarvestingModal';
import texts from '../texts';
import '../styles.css';

interface HarvestingProgressCardProps {
  harvestingStatus: HarvestingStatus | null;
  sendHarvestingRequest: (message: string) => void;
  harvestingError: boolean;
  refreshHarvestingStatus: () => void;
  isRequestLoading: boolean;
  requestError: Error | null;
  requestResponse: { [key: string]: unknown } | null;
  isHarvestingLoading: boolean;
}

export const HarvestingProgressCard = ({
  harvestingStatus,
  sendHarvestingRequest,
  harvestingError,
  refreshHarvestingStatus,
  isRequestLoading,
  requestError,
  requestResponse,
  isHarvestingLoading,
}: HarvestingProgressCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const previousResponseRef = useRef<{ [key: string]: unknown } | null>(null);

  const dayInterval = (lastHarvestingDateString?: string) => {
    if (!lastHarvestingDateString) return true;
    const lastHarvestingDate = new Date(lastHarvestingDateString);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - lastHarvestingDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference > 7;
  };

  const result = dayInterval(harvestingStatus?.lastHarvestingDate);

  // Derive success and error states from request response/error
  const { success, errorMessage } = useMemo(() => {
    const hasNewResponse = requestResponse && requestResponse !== previousResponseRef.current && !isRequestLoading;
    const hasError = requestError && !isRequestLoading;

    return {
      success: hasNewResponse,
      errorMessage: hasError ? texts.type.error.success : validationError,
    };
  }, [requestResponse, requestError, isRequestLoading, validationError]);

  // Single useEffect to handle request completion side effects
  useEffect(() => {
    if (requestResponse && requestResponse !== previousResponseRef.current && !isRequestLoading) {
      previousResponseRef.current = requestResponse;
      setModalOpen(false);
      setValidationError(null);
      refreshHarvestingStatus();
    }
  }, [requestResponse, isRequestLoading, refreshHarvestingStatus]);

  const sendRequest = useCallback((requestText: string) => {
    if (!requestText.trim()) {
      setValidationError('This field is mandatory');
      return;
    }
    setValidationError(null);
    setModalOpen(false); // Close modal immediately when sending request
    sendHarvestingRequest(requestText);
  }, [sendHarvestingRequest]);

  const triggerModal = useCallback(() => {
    if (!isRequestLoading) {
      setModalOpen(true);
    }
  }, [isRequestLoading]);

  const handleButtonClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const renderView = useCallback(() => {
    const lastHarvestingDate = new Date(
      harvestingStatus?.lastHarvestingRequestDate || ''
    );
    const currentDate = new Date();

    const differenceInTime =
      currentDate.getTime() - lastHarvestingDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays > 5 || !harvestingStatus?.lastHarvestingRequestDate) {
      return (
        <Button
          className={classNames('indexing-button', {
            'cursor-disable': isRequestLoading || isHarvestingLoading,
          })}
          onClick={triggerModal}
          type="primary"
        >
          {(isRequestLoading || isHarvestingLoading) ? (
            <div className="spinner-wrapper">
              <span>Loading</span>
              <Spin indicator={<LoadingOutlined spin />} className="button-loader" />
            </div>
          ) : (
            texts.progress.action
          )}
        </Button>
      );
    }

    if (differenceInDays < 5) {
      return (
        <div className="info-success">
          <CheckOutlined className="tick" />
          <span className="warning-text">{`Your request has been submitted and the CORE Team has been informed.
            You last sent a harvesting request on ${harvestingStatus?.lastHarvestingRequestDate?.split(' ')[0]
            }`}</span>
        </div>
      );
    }

    return null;
  }, [harvestingStatus?.lastHarvestingRequestDate, isRequestLoading, isHarvestingLoading, triggerModal]);

  const renderedContent = useMemo(() => {
    if (harvestingError) {
      return (
        <div className="errors-wrapper">
          <InfoCircleFilled className="info-icon" />
          <p className="error-text">
            Request reindexing is not available at the moment.
          </p>
        </div>
      );
    }

    if (!harvestingStatus || isHarvestingLoading) {
      return (
        <div className="data-spinner-wrapper">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
          <p className="spinner-text">Loading...</p>
        </div>
      );
    }

    return <div className="button-wrapper">{renderView()}</div>;
  }, [harvestingError, harvestingStatus, renderView, isHarvestingLoading]);

  const getTimeSinceLastHarvest = useCallback(() => {
    if (!harvestingStatus?.lastHarvestingDate) return Infinity;

    const lastHarvestingDate = new Date(harvestingStatus.lastHarvestingDate);
    const currentDate = new Date();
    const differenceInTime =
      currentDate.getTime() - lastHarvestingDate.getTime();
    return differenceInTime / (1000 * 3600 * 24);
  }, [harvestingStatus?.lastHarvestingDate]);

  const getCurrentStep = useCallback(() => {
    if (!harvestingStatus) return 0;

    const isScheduled =
      harvestingStatus?.scheduledState === 'IN_DOWNLOAD_METADATA_QUEUE' && !result;
    const isInProgress =
      (!result && harvestingStatus?.scheduledState !== 'IN_DOWNLOAD_METADATA_QUEUE') ||
      harvestingStatus?.scheduledState === 'PENDING';
    const isFinished =
      result && harvestingStatus?.scheduledState !== 'PENDING';

    if (isFinished) return 2;
    if (isInProgress) return 1;
    if (isScheduled) return 0;
    return 0;
  }, [harvestingStatus, result]);

  const steps = useMemo(() => {
    const currentStep = getCurrentStep();
    return [
      {
        title: (
          <Tooltip title={texts.type.scheduled.tooltip} placement="top">
            <span>{texts.type.scheduled.title}</span>
          </Tooltip>
        ),
        status: (currentStep === 0 ? 'process' : 'wait') as 'process' | 'finish' | 'wait',
      },
      {
        title: (
          <Tooltip title={texts.type.progress.tooltip} placement="top">
            <span>{texts.type.progress.title}</span>
          </Tooltip>
        ),
        status: (currentStep === 1 ? 'process' : 'wait') as 'process' | 'finish' | 'wait',
      },
      {
        title: (
          <Tooltip title={texts.type.finished.tooltip} placement="top">
            <span>{texts.type.finished.title}</span>
          </Tooltip>
        ),
        status: (currentStep === 2 ? 'process' : 'wait') as 'process' | 'finish' | 'wait',
      },
    ];
  }, [getCurrentStep]);

  const renderErrorView = () => (
    <p className="no-data-message indexing-card-error-message">
      Failed to load harvesting status. Please try again later.
    </p>
  );

  return (
    <Card className="progress-wrapper">
      <div
        className={classNames('title-wrapper', {
          'title-option': !success,
          'error-message': errorMessage,
          spaceing: getTimeSinceLastHarvest() >= 60,
        })}
      >
        <Card.Meta
          title={<h2 className="mai-title">{texts.progress.title}</h2>}
        />
      </div>
      {harvestingError ? (
        renderErrorView()
      ) : !harvestingStatus || isHarvestingLoading ? (
        <div className="data-spinner-wrapper-harvesting">
          <p className="spinner-text">Loading...</p>
        </div>
      ) : (
        <>
          {getTimeSinceLastHarvest() >= 60 && (
            <div className="info-warning-wrapper">
              <ExclamationCircleFilled className="info-warning" />
              <span className="info-text">{texts.type.error.error}</span>
            </div>
          )}
          <div className="request-date-wrapper">
            {modalOpen &&
              harvestingStatus?.scheduledState ===
              'IN_DOWNLOAD_METADATA_QUEUE' &&
              !result && (
                <HarvestingModal
                  title={texts.modal.scheduled.title}
                  description={texts.modal.scheduled.description}
                  placeholder={texts.modal.scheduled.input}
                  handleButtonClose={handleButtonClose}
                  handleButtonClick={sendRequest}
                />
              )}
            {modalOpen &&
              (!result || harvestingStatus?.scheduledState === 'PENDING') && (
                <HarvestingModal
                  title={texts.modal.progress.title}
                  description={texts.modal.progress.description}
                  placeholder={texts.modal.progress.input}
                  handleButtonClose={handleButtonClose}
                  handleButtonClick={sendRequest}
                />
              )}
            {modalOpen &&
              result &&
              harvestingStatus?.scheduledState !== 'PENDING' && (
                <HarvestingModal
                  title={texts.modal.finished.title}
                  description={texts.modal.finished.description}
                  placeholder={texts.modal.finished.input}
                  handleButtonClose={handleButtonClose}
                  handleButtonClick={sendRequest}
                />
              )}
          </div>
          {getTimeSinceLastHarvest() < 60 && (
            <>
              <div className="progress-steps-wrapper">
                <Steps
                  current={getCurrentStep()}
                  items={steps}
                  className="harvesting-steps"
                  responsive
                />
              </div>
              <div className="status-description">
                {texts.progress.description}
              </div>
            </>
          )}
          {renderedContent}
        </>
      )}
    </Card>
  );
};
