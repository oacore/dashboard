import { useCallback, useEffect, useMemo } from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Alert, Button, Checkbox, ConfigProvider, Form, Input, InputNumber, Radio, Select, Spin, Switch, message } from 'antd';
import type { ThemeConfig } from 'antd';
import { Link } from 'react-router-dom';

import { customColors } from '@/config/theme';
import { useDashboardRoute } from '@hooks/useDashboardRoute.ts';

import { mapFreshFindsSettingsToForm, useFreshFindsSettings } from '../hooks/useFreshFindsSettings';
import { articleTemplateData } from '../texts';
import type { FreshFindsSettingsFormValues } from '../types/settings.types';

const DEFAULT_MAX_PAPERS = 500;

const EMPTY_SETTINGS: FreshFindsSettingsFormValues = {
  sources: [],
  notifyByEmail: false,
  fullTextOnly: false,
  depositFrequency: 'monthly',
  autoDeposit: false,
  maxPapersPerDeposit: null,
  username: '',
  swordPassword: '',
  swordEndpointUrl: '',
  repositoryProfile: undefined,
};

const settingsTheme: ThemeConfig = {
  components: {
    Switch: {
      colorPrimary: customColors.success,
      colorPrimaryHover: '#7CB342',
    },
    Input: {
      colorTextPlaceholder: customColors.primary,
    },
    InputNumber: {
      colorText: customColors.primary,
    },
    Select: {
      colorTextPlaceholder: customColors.primary,
      colorBorder: customColors.primary,
      controlHeight: 44,
    },
  },
};

export const FreshFindsSettings = () => {
  const settings = articleTemplateData.settings;
  const [form] = Form.useForm<FreshFindsSettingsFormValues>();
  const { buildPath } = useDashboardRoute();
  const documentationPath = buildPath('documentation');
  const { settings: settingsData, error, isLoading, isSaving, saveSettings } = useFreshFindsSettings();

  useEffect(() => {
    if (!settingsData) {
      return;
    }

    form.setFieldsValue(mapFreshFindsSettingsToForm(settingsData));
  }, [form, settingsData]);

  const repositoryProfileOptions = useMemo(() => {
    const options = settings.repositoryProfiles.map((profile) => ({
      value: profile.id,
      label: profile.label,
    }));
    const currentProfile = settingsData?.repositoryProfile;

    if (currentProfile && !options.some((option) => option.value === currentProfile)) {
      return [{ value: currentProfile, label: currentProfile }, ...options];
    }

    return options;
  }, [settings.repositoryProfiles, settingsData?.repositoryProfile]);

  const frequencyOptions = useMemo(() => {
    const currentFrequency = settingsData?.depositFrequency;

    if (currentFrequency && !settings.frequencies.some((frequency) => frequency.id === currentFrequency)) {
      return [...settings.frequencies, { id: currentFrequency, label: currentFrequency }];
    }

    return settings.frequencies;
  }, [settings.frequencies, settingsData?.depositFrequency]);

  const handleSave = useCallback(async (values: FreshFindsSettingsFormValues) => {
    const nextValues = {
      ...values,
      maxPapersPerDeposit: values.maxPapersPerDeposit ?? DEFAULT_MAX_PAPERS,
    };

    try {
      const saved = await saveSettings(nextValues);
      if (!saved) {
        return;
      }

      form.setFieldsValue({
        ...nextValues,
        swordPassword: '',
      });
      message.success(settings.saveSuccess);
    } catch {
      message.error(settings.saveError);
    }
  }, [form, saveSettings, settings.saveError, settings.saveSuccess]);

  return (
    <ConfigProvider theme={settingsTheme}>
      <Spin spinning={isLoading}>
      <Form
        form={form}
        className="fresh-finds-settings"
        layout="vertical"
        initialValues={EMPTY_SETTINGS}
        onFinish={handleSave}
        requiredMark={false}
      >
        <h3 className="fresh-finds-settings__title">{settings.title}</h3>
        {error && (
          <Alert
            className="fresh-finds-settings__error"
            type="error"
            showIcon
            title="Failed to load Fresh Finds settings."
          />
        )}
        <div className="fresh-finds-settings__grid">
          <div className="fresh-finds-settings__column">
            <span id="fresh-finds-sources-label" className="fresh-finds-settings__label">
              {settings.sourcesLabel}
            </span>
            <Form.Item name="sources" className="fresh-finds-settings__sources-item">
              <Checkbox.Group
                className="fresh-finds-settings__sources"
                aria-labelledby="fresh-finds-sources-label"
              >
                {settings.sources.map((source) => (
                  <Checkbox key={source.id} value={source.id}>
                    {source.label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>

            <div className="fresh-finds-settings__toggle">
              <Form.Item name="autoDeposit" valuePropName="checked" noStyle>
                <Switch
                  id="fresh-finds-auto-deposit"
                  className="fresh-finds-settings__switch"
                  aria-label={settings.autoDeposit}
                />
              </Form.Item>
              <label htmlFor="fresh-finds-auto-deposit" className="fresh-finds-settings__toggle-label">
                {settings.autoDeposit}
              </label>
            </div>

            <span className="fresh-finds-settings__label fresh-finds-settings__label--section">
              {settings.swordEndpoint}
            </span>
            <Form.Item name="username" className="fresh-finds-settings__field">
              <Input placeholder={settings.username} aria-label={settings.username} autoComplete="off" />
            </Form.Item>
            <Form.Item name="swordPassword" className="fresh-finds-settings__field">
              <Input.Password
                placeholder={settings.password}
                aria-label={settings.password}
                autoComplete="new-password"
              />
            </Form.Item>
            {settingsData?.swordPasswordConfigured && (
              <p className="fresh-finds-settings__hint">{settings.passwordConfigured}</p>
            )}
            <Form.Item name="swordEndpointUrl" className="fresh-finds-settings__field">
              <Input placeholder={settings.swordUrl} aria-label={settings.swordUrl} autoComplete="off" />
            </Form.Item>
            <Form.Item name="repositoryProfile" className="fresh-finds-settings__field">
              <Select
                className="fresh-finds-settings__select"
                placeholder={settings.repositoryProfile}
                aria-label={settings.repositoryProfile}
                options={repositoryProfileOptions}
              />
            </Form.Item>
          </div>

          <div className="fresh-finds-settings__column">
            <div className="fresh-finds-settings__toggle">
              <Form.Item name="notifyByEmail" valuePropName="checked" noStyle>
                <Switch
                  id="fresh-finds-notify-email"
                  className="fresh-finds-settings__switch"
                  aria-label={settings.notifyByEmail}
                />
              </Form.Item>
              <label htmlFor="fresh-finds-notify-email" className="fresh-finds-settings__toggle-label">
                {settings.notifyByEmail}
              </label>
            </div>

            <div className="fresh-finds-settings__toggle">
              <Form.Item name="fullTextOnly" valuePropName="checked" noStyle>
                <Switch
                  id="fresh-finds-full-text"
                  className="fresh-finds-settings__switch"
                  aria-label={settings.fullTextOnly}
                />
              </Form.Item>
              <label htmlFor="fresh-finds-full-text" className="fresh-finds-settings__toggle-label">
                {settings.fullTextOnly}
              </label>
            </div>

            <span id="fresh-finds-frequency-label" className="fresh-finds-settings__label">
              {settings.depositFrequencyLabel}
            </span>
            <Form.Item name="depositFrequency" className="fresh-finds-settings__frequency-item">
              <Radio.Group
                className="fresh-finds-settings__frequency"
                aria-labelledby="fresh-finds-frequency-label"
              >
                {frequencyOptions.map((frequency) => (
                  <Radio key={frequency.id} value={frequency.id}>
                    {frequency.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <div className="fresh-finds-settings__max">
              <label htmlFor="fresh-finds-max-papers" className="fresh-finds-settings__toggle-label">
                {settings.maxPapers}
              </label>
              <Form.Item name="maxPapersPerDeposit" noStyle>
                <InputNumber
                  id="fresh-finds-max-papers"
                  className="fresh-finds-settings__max-input"
                  min={1}
                  controls={false}
                  aria-label={settings.maxPapers}
                />
              </Form.Item>
            </div>

            <Alert
              className="fresh-finds-settings__pull-alert"
              type="success"
              showIcon
              icon={<InfoCircleFilled aria-hidden />}
              title={(
                <span>
                  {settings.pullNotice}{' '}
                  <Link
                    className="fresh-finds-settings__doc-link"
                    to={documentationPath}
                    tabIndex={0}
                    aria-label={settings.pullLink}
                  >
                    {settings.pullLink}
                  </Link>
                </span>
              )}
            />
          </div>
        </div>

        <div className="fresh-finds-settings__actions">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSaving}
            disabled={isLoading}
            aria-label={settings.save}
          >
            {settings.save}
          </Button>
        </div>
      </Form>
      </Spin>
    </ConfigProvider>
  );
};
