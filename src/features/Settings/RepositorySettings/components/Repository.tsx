import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { CrPaper } from '@core/core-ui';
import { CrInput } from '@core/core-ui';
import { Markdown } from '@core/core-ui';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import { useRorSuggestions } from '@features/Settings/OrganisationalSettings/hooks/useRorSuggestions';
import { DropdownInput } from '@features/Settings/OrganisationalSettings/components/DropdownInput';
import { useUpdateDataProvider } from '../hooks/useUpdateDataProvider';
import notificationText from '@features/Settings/texts';
import '../styles.css';

interface RepositoryProps {
  className?: string;
}

export const Repository: React.FC<RepositoryProps> = ({ className }) => {
  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();
  const { updateDataProvider } = useUpdateDataProvider();

  const [rorId, setRorId] = useState(selectedDataProvider?.rorData?.rorId ?? '');
  const [rorName, setRorName] = useState(selectedDataProvider?.rorData?.rorName ?? '');
  const [repositoryName, setRepositoryName] = useState(selectedDataProvider?.name ?? '');
  const [oaiUrl, setOaiUrl] = useState(selectedDataProvider?.oaiPmhBase || '');
  const [isChanged, setChanged] = useState(false);
  const [isNameOpen, setNameIsOpen] = useState(false);
  const [isIdOpen, setIdIsOpen] = useState(false);
  const [isNameChanged, setNameChanged] = useState(false);
  const [isEmailChanged, setEmailChanged] = useState(false);
  const [isOaiChanged, setOaiChanged] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isNameSaveSuccessful, setIsNameSaveSuccessful] = useState(false);
  const [isEmailSaveSuccessful, setIsEmailSaveSuccessful] = useState(false);
  const [isRorSaveSuccessful, setIsRorSaveSuccessful] = useState(false);
  const [isOaiSaveSuccessful, setIsOaiSaveSuccessful] = useState(false);

  // Use ROR suggestions hook
  const {
    suggestions: suggestionsId,
    setIsInitialLoad: setIsInitialLoadId,
  } = useRorSuggestions({
    value: rorId,
    isOpen: isIdOpen,
    initialValue: selectedDataProvider?.rorData?.rorId,
    skipInitialFetch: true,
    onOpenChange: setIdIsOpen,
  });

  const {
    suggestions: suggestionsName,
    setIsInitialLoad: setIsInitialLoadName,
  } = useRorSuggestions({
    value: rorName,
    isOpen: isNameOpen,
    initialValue: selectedDataProvider?.rorData?.rorName,
    skipInitialFetch: true,
    onOpenChange: setNameIsOpen,
  });

  // Sync state when dataProvider changes
  useEffect(() => {
    if (selectedDataProvider) {
      setRorId(selectedDataProvider.rorData?.rorId ?? '');
      setRorName(selectedDataProvider.rorData?.rorName ?? '');
      setRepositoryName(selectedDataProvider.name ?? '');
      setOaiUrl(selectedDataProvider.oaiPmhBase || '');
      setIsInitialLoadId(true);
      setIsInitialLoadName(true);
    }
  }, [selectedDataProvider, setIsInitialLoadId, setIsInitialLoadName]);


  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const target = event.currentTarget;
      const formData = new FormData(target);
      const data = Object.fromEntries(formData.entries());

      const result = await updateDataProvider(data);

      if (data.fieldId === 'oaiPmhUrl') {
        setIsFormSubmitted(true);
      }

      if (result.type === 'success') {
        // Set success state for the specific field that was saved
        if (data.fieldId === 'oaiPmhUrl') {
          setOaiChanged(false);
          setIsOaiSaveSuccessful(true);
        } else if (data.name) {
          setNameChanged(false);
          setIsNameSaveSuccessful(true);
        } else if (data.ror_id || data.rorName) {
          setChanged(false);
          setIsRorSaveSuccessful(true);
        } else if (data.email) {
          setEmailChanged(false);
          setIsEmailSaveSuccessful(true);
        }
      }
    },
    [updateDataProvider]
  );

  const handleRorInputChange = useCallback(
    (field: 'id' | 'name') => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (field === 'id') {
        setRorId(value);
        setIsInitialLoadId(false);
        setIdIsOpen(value.length > 0);
      } else {
        setRorName(value);
        setIsInitialLoadName(false);
        setNameIsOpen(value.length > 0);
      }
      setIsRorSaveSuccessful(false);
    },
    [setIsInitialLoadId, setIsInitialLoadName]
  );

  const handleRorOptionClick = useCallback((field: 'id' | 'name') => () => {
    if (field === 'id') {
      setIdIsOpen(false);
    } else {
      setNameIsOpen(false);
    }
  }, []);

  const handleChange = useCallback(() => {
    setChanged(true);
    setIsRorSaveSuccessful(false);
  }, []);

  const handleNameChange = useCallback((value: string) => {
    setRepositoryName(value);
    setNameChanged(true);
    setIsNameSaveSuccessful(false);
  }, []);

  const handleOaiUrlChange = useCallback((value: string) => {
    setOaiUrl(value);
    setOaiChanged(true);
    setIsOaiSaveSuccessful(false);
    setIsFormSubmitted(false);
  }, []);

  const renderRORWarning = useCallback(() => {
    if (
      organisation?.rorId &&
      selectedDataProvider?.rorData?.rorId &&
      organisation.rorId !== selectedDataProvider.rorData.rorId
    ) {
      return (
        <div className="warning-wrapper">
          <ExclamationCircleOutlined />
          <span>
            The ROR ID for your organisation is different from the ROR ID for your repository.
          </span>
        </div>
      );
    }
    return null;
  }, [organisation?.rorId, selectedDataProvider?.rorData?.rorId]);

  const content = notificationText.organisation;

  if (!selectedDataProvider) {
    return null;
  }

  return (
    <CrPaper className={classNames('access-users-section', className)}>
      <div className="header-wrapper">
        <h2 className="header-wrapper-title">Your repository</h2>
      </div>
      {/* Repository Name Form */}
      <div className="form-wrapper">
        <div className="form-inner-wrapper">
          <form
            name="data-provider"
            onSubmit={handleSubmit}
            onChange={() => {
              setNameChanged(true);
              setIsNameSaveSuccessful(false);
            }}
          >
            <CrInput
              id="settings-repository-name"
              label={!selectedDataProvider.name ? 'Name' : undefined}
              name="name"
              value={repositoryName}
              onChange={handleNameChange}
              placeholder={selectedDataProvider.name ? undefined : 'Name'}
            />
            {isNameChanged && !isNameSaveSuccessful && (
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            )}
            {isNameSaveSuccessful && (
              <div className="form-message-success">
                Settings were updated successfully!
              </div>
            )}
          </form>
        </div>
        <div className="main-warning-wrapper" />
      </div>

      {/* Email Form */}
      <div className="form-wrapper">
        <div className="form-inner-wrapper">
          <form
            name="data-provider"
            onSubmit={handleSubmit}
            onChange={() => {
              setEmailChanged(true);
              setIsEmailSaveSuccessful(false);
            }}
          >
            <CrInput
              id="settings-repository-email"
              label={!selectedDataProvider.email ? 'Email' : undefined}
              name="email"
              value={selectedDataProvider.email || ''}
              readOnly
              placeholder={selectedDataProvider.email ? undefined : 'Email'}
            />
            {isEmailChanged && !isEmailSaveSuccessful && (
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            )}
            {isEmailSaveSuccessful && (
              <div className="form-message-success">
                Settings were updated successfully!
              </div>
            )}
          </form>
          <Markdown className="ror-form-description">
            {content.emailDescription}
          </Markdown>
        </div>
        <div className="main-warning-wrapper" />
      </div>

      {/* ROR Form */}
      <div className="form-wrapper form-start">
        <div className="form-inner-wrapper">
          <form
            name="data-provider"
            onSubmit={handleSubmit}
            onChange={handleChange}
          >
            <div className="repo-fields-wrapper">
              <div className="input-item">
                <DropdownInput
                  id="ror-id"
                  label="ROR id"
                  name="ror_id"
                  isOpen={isIdOpen}
                  suggestions={suggestionsId}
                  handleOptionClick={handleRorOptionClick('id')}
                  setRorName={setRorName}
                  setRorId={setRorId}
                  value={rorId}
                  onChange={handleRorInputChange('id')}
                />
              </div>
              <div className="input-item">
                <DropdownInput
                  id="ror-name"
                  label="ROR registered name"
                  name="rorName"
                  value={rorName}
                  suggestions={suggestionsName}
                  isOpen={isNameOpen}
                  onChange={handleRorInputChange('name')}
                  handleOptionClick={handleRorOptionClick('name')}
                  setRorName={setRorName}
                  setRorId={setRorId}
                />
              </div>
            </div>
            {isChanged && !isRorSaveSuccessful && (
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            )}
            {isRorSaveSuccessful && (
              <div className="form-message-success">
                Settings were updated successfully!
              </div>
            )}
          </form>
          <Markdown className="ror-form-description">
            {content.rordescription}
          </Markdown>
        </div>
        <div className="main-warning-wrapper">{renderRORWarning()}</div>
      </div>

      {/* OAI URL Form */}
      <div className="form-wrapper">
        <div className="form-inner-wrapper">
          <form
            name="data-provider"
            onSubmit={handleSubmit}
            onChange={() => {
              setOaiChanged(true);
              setIsOaiSaveSuccessful(false);
              setIsFormSubmitted(false);
            }}
          >
            <input type="hidden" name="fieldId" value="oaiPmhUrl" />
            <CrInput
              id="oaiPmhUrl"
              label="OAI based URL"
              name="oaiPmhEndpoint"
              value={oaiUrl}
              onChange={handleOaiUrlChange}
              placeholder="OAI based URL"
            />
            <Markdown className="ror-form-description">
              {content.oaiDescription}
            </Markdown>
            {isOaiChanged && !isOaiSaveSuccessful && (
              <div style={{ marginTop: '16px' }}>
                <Button className="spacing" type="primary" htmlType="submit">
                  Save
                </Button>
              </div>
            )}
            {isOaiSaveSuccessful && !isFormSubmitted && (
              <div className="form-message-success">
                Settings were updated successfully!
              </div>
            )}
            {isFormSubmitted && (
              <div className="info-indicator-wrapper">
                <div className="info-indicator">
                  <CheckCircleOutlined />
                  <span className="info-text">
                    Your request for changing OAI PMH URL has been successfully sent. Your suggestion will be reviewed by our
                    technical specialists and it may take a few days for the changes to propagate across the whole of CORE data.
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="main-warning-wrapper" />
      </div>
    </CrPaper>
  );
};
