import { CrFeatureLayout, CrHeader, Markdown, CrMessage, CrShowMore } from '@oacore/core-ui';
import { useEffect, useMemo, useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import validatorData from './texts';
import info from '@/assets/icons/info.svg';
import "./styles.css"
import MyRepository from '@features/Validator/MyReposiyory/MyRepository.tsx';
import RioxValidator from '@features/Validator/RIoxValidator/RIoxValidator.tsx';
import { useValidatorStore } from './store/validatorStore';
import type { ValidationItem } from './types';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';

const TABS = {
  myRepository: 'myRepository',
  validation: 'validation'
} as const;

export const ValidatorFeature = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS.myRepository);
  const [filteredWarning, setFilteredWarning] = useState<ValidationItem[]>([]);
  const [filteredIssue, setFilteredIssue] = useState<ValidationItem[]>([]);

  const {
    validationResult,
    recordValue,
    isValidating,
    error,
    setRecordValue,
    rioxValidation,
    clearError
  } = useValidatorStore();

  const { selectedDataProvider } = useDataProviderStore();

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleValidateClick = async () => {
    await rioxValidation(selectedDataProvider?.id || 0);
  };

  const handleTextareaChange = (value: string) => {
    setRecordValue(value);
    if (error) {
      clearError();
    }
  };

  const issueList = useMemo(
    () => validatorData.actions?.filter((item) => item.severity === 'ERROR') || [],
    []
  );

  const warningList = useMemo(
    () => validatorData.actions?.filter((item) => item.severity === 'WARNING') || [],
    []
  );

  const filterList = (list: ValidationItem[], missingData: Record<string, string[]> | undefined): ValidationItem[] => {
    if (!missingData || Object.keys(missingData).length === 0) return [];

    const filteredList = list.filter((item) =>
      Object.keys(missingData)
        .map((issue) => issue.toLowerCase())
        .includes(item.key.toLowerCase())
    );

    const dataKeys = Object.keys(missingData);
    const foundData = filteredList.map((item) => item.key.toLowerCase());
    const mismatchedDataKeys = dataKeys?.filter(
      (key) => !foundData.includes(key.toLowerCase())
    );
    const mismatchedData = Object.fromEntries(
      Object.entries(missingData).filter(([key]) =>
        mismatchedDataKeys.some(
          (mismatchedKey) =>
            mismatchedKey.localeCompare(key, undefined, {
              sensitivity: 'accent',
            }) === 0
        )
      )
    );
    const mismatchedArray = Object.entries(mismatchedData).map(
      ([key, value]) => ({
        key,
        messages: value,
      })
    );

    return [...filteredList, ...mismatchedArray];
  };

  useEffect(() => {
    const finalData = filterList(
      issueList,
      validationResult?.missingRequiredData
    );
    setFilteredIssue(finalData);
  }, [validationResult?.missingRequiredData, issueList]);

  useEffect(() => {
    const finalData = filterList(
      warningList,
      validationResult?.missingOptionalData
    );
    setFilteredWarning(finalData);
  }, [validationResult?.missingOptionalData, warningList]);

  const tabItems: TabsProps['items'] = [
    {
      key: TABS.myRepository,
      label: validatorData.validator.validator.actions[0].name,
      children: <MyRepository />,
    },
    {
      key: TABS.validation,
      label: validatorData.validator.validator.actions[1].name,
      children: <RioxValidator
        handleValidateClick={handleValidateClick}
        validationResult={validationResult}
        handleTextareaChange={handleTextareaChange}
        recordValue={recordValue}
        filteredIssue={filteredIssue}
        filteredWarning={filteredWarning}
        isValidating={isValidating}
        error={error}
      />,
    },
  ];

  return (
    <CrFeatureLayout>
      <CrHeader
        title={validatorData.validator.validator.title}
        identifier="BETA"
        showMore={
          <CrShowMore
            text={validatorData.validator.description}
            maxLetters={320}
          />
        }
      />
      <CrMessage alignItems="flex-start" variant="danger" className="error-message">
        <img className="info-icon" src={info} alt="riox" />
        <Markdown className="message-text">
          {validatorData.validator.rioxInfo}
        </Markdown>
      </CrMessage>

      <div className="validation-field">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className="custom-tabs"
          tabBarStyle={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 0,
          }}
        />
      </div>
    </CrFeatureLayout>
  );
};
