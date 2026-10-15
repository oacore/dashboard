import { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Markdown } from '@oacore/core-ui';
import { Alert, Button, Checkbox, ConfigProvider, Form, Input, InputNumber, Radio, Select, Spin, Switch, message } from 'antd';
import type { FormItemProps, ThemeConfig } from 'antd';

import { customColors } from '@/config/theme';

import { useFreshFindsSettings } from '../hooks/useFreshFindsSettings';
import { useFreshFindsStore } from '../store/freshFindsStore';
import { articleTemplateData } from '../texts';
import type { FreshFindsSettingsFormValues } from '../types/settings.types';
import '../FreshFindsFeature.css';

const text = articleTemplateData.settings;

const requiredRules = (messageText: string): FormItemProps['rules'] => [
  { required: true, message: messageText },
];

const withRequiredClass = (className: string, isRequired: boolean) =>
  isRequired ? `${className} fresh-finds-settings__label--required` : className;

const EMPTY_FORM: FreshFindsSettingsFormValues = {
  sources: {
    coreNetworkRepositories: false,
    institutionalRepositories: false,
    journals: false,
    preprintServers: false,
    crossref: false,
  },
  notifyByEmail: false,
  depositOnlyWithFullText: false,
  depositFrequency: 'monthly',
  autoDepositEnabled: false,
  maximumPapersPerDeposit: 500,
  swordUsername: '',
  swordPassword: '',
  swordEndpointUrl: '',
  repositoryProfile: undefined,
  integrationMode: undefined,
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

type SettingsSwitchProps = {
  name: keyof FreshFindsSettingsFormValues;
  id: string;
  label: string;
  disabled?: boolean;
};

const SettingsSwitch = ({ name, id, label, disabled = false }: SettingsSwitchProps) => (
  <div
    className={`fresh-finds-settings__toggle${disabled ? ' fresh-finds-settings__toggle--disabled' : ''}`}
    aria-disabled={disabled}
  >
    <Form.Item name={name} valuePropName="checked" noStyle>
      <Switch id={id} className="fresh-finds-settings__switch" aria-label={label} disabled={disabled} />
    </Form.Item>
    <label htmlFor={id} className="fresh-finds-settings__toggle-label">
      {label}
    </label>
  </div>
);

type SettingsSelectProps = {
  name: keyof FreshFindsSettingsFormValues;
  placeholder: string;
  options: { id: string; label: string }[];
  rules: FormItemProps['rules'];
};

const SettingsSelect = ({ name, placeholder, options, rules }: SettingsSelectProps) => (
  <Form.Item name={name} className="fresh-finds-settings__field" rules={rules}>
    <Select
      className="fresh-finds-settings__select"
      placeholder={placeholder}
      aria-label={placeholder}
      aria-required
      options={options.map((option) => ({
        value: option.id,
        label: option.label,
      }))}
    />
  </Form.Item>
);

export const FreshFindsSettings = () => {
  const [form] = Form.useForm<FreshFindsSettingsFormValues>();
  const [showSourcesError, setShowSourcesError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const ignoreNextChangeRef = useRef(false);
  const { formValues, passwordConfigured, error, isLoading, isSaving, saveSettings } = useFreshFindsSettings();
  const settingsAttentionRequestId = useFreshFindsStore((state) => state.settingsAttentionRequestId);
  const integrationMode = Form.useWatch('integrationMode', form);
  const sources = Form.useWatch('sources', form);
  const resolvedIntegrationMode = integrationMode ?? formValues?.integrationMode;
  const isPullMode = resolvedIntegrationMode === 'pull';
  const isPushMode = resolvedIntegrationMode === 'push';
  const hasSource = Boolean(sources && Object.values(sources).some(Boolean));

  const pushFieldRules = (messageText: string, skipWhenPasswordSaved = false): FormItemProps['rules'] => [
    ({ getFieldValue }) => ({
      validator: async (_, value: unknown) => {
        if (getFieldValue('integrationMode') !== 'push') {
          return;
        }

        if (skipWhenPasswordSaved && passwordConfigured) {
          return;
        }

        const isMissing = typeof value === 'number'
          ? value < 1
          : value == null || String(value).trim() === '';

        if (isMissing) {
          throw new Error(messageText);
        }
      },
    }),
  ];

  useEffect(() => {
    if (!isSaved) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSaved(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [isSaved]);

  useEffect(() => {
    if (isLoading || settingsAttentionRequestId === 0) {
      return;
    }

    setShowSourcesError(true);
    void form.validateFields().catch(() => undefined);
  }, [form, isLoading, settingsAttentionRequestId]);

  const handleSave = async (values: FreshFindsSettingsFormValues) => {
    if (!Object.values(values.sources).some(Boolean)) {
      setShowSourcesError(true);
      return;
    }

    try {
      await saveSettings(values);
      ignoreNextChangeRef.current = true;
      form.setFieldValue('swordPassword', '');
      setIsSaved(true);
      message.success(text.saveSuccess);
    } catch {
      setIsSaved(false);
      message.error(text.saveError);
    }
  };

  const handleValuesChange = () => {
    if (ignoreNextChangeRef.current) {
      ignoreNextChangeRef.current = false;
      return;
    }

    setIsSaved(false);
  };

  if (isLoading && !formValues) {
    return (
      <div className="fresh-finds-settings__loading">
        <Spin />
      </div>
    );
  }

  return (
    <ConfigProvider theme={settingsTheme}>
      <Form
        form={form}
        className="fresh-finds-settings"
        layout="vertical"
        key={formValues ? 'loaded' : 'empty'}
        initialValues={formValues ?? EMPTY_FORM}
        onFinish={handleSave}
        onFinishFailed={() => setShowSourcesError(true)}
        onValuesChange={handleValuesChange}
        requiredMark={false}
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
      >
        <h3 className="fresh-finds-settings__title">{text.title}</h3>
        {error && (
          <Alert
            className="fresh-finds-settings__error"
            type="error"
            showIcon
            title="Failed to load Fresh Finds settings."
          />
        )}
        <div className="fresh-finds-settings__grid">
          {/*left*/}
          <div className="fresh-finds-settings__column">
            <span
              id="fresh-finds-sources-label"
              className="fresh-finds-settings__label fresh-finds-settings__label--required"
            >
              {text.sourcesLabel}
            </span>
            <div
              className="fresh-finds-settings__sources"
              role="group"
              aria-labelledby="fresh-finds-sources-label"
            >
              {text.sources.map((source) => (
                <Form.Item
                  key={source.id}
                  name={['sources', source.id]}
                  valuePropName="checked"
                  className="fresh-finds-settings__source"
                >
                  <Checkbox>{source.label}</Checkbox>
                </Form.Item>
              ))}
            </div>
            {showSourcesError && !hasSource && (
              <span className="fresh-finds-settings__field-error" role="alert">
                {text.sourcesRequired}
              </span>
            )}

            <SettingsSwitch
              name="autoDepositEnabled"
              id="fresh-finds-auto-deposit"
              label={text.autoDeposit}
            />
          </div>

          {/*right*/}
          <fieldset className="fresh-finds-settings__column" disabled={isPullMode}>
            <span
              id="fresh-finds-frequency-label"
              className={withRequiredClass('fresh-finds-settings__label', isPushMode)}
            >
              {text.depositFrequencyLabel}
            </span>
            <Form.Item
              name="depositFrequency"
              className="fresh-finds-settings__frequency-item"
              dependencies={['integrationMode']}
              rules={pushFieldRules(text.depositFrequencyRequired)}
            >
              <Radio.Group
                className="fresh-finds-settings__frequency"
                aria-labelledby="fresh-finds-frequency-label"
              >
                {text.frequencies.map((frequency) => (
                  <Radio key={frequency.id} value={frequency.id}>
                    {frequency.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <div className="fresh-finds-settings__max">
              <label
                htmlFor="fresh-finds-max-papers"
                className={withRequiredClass('fresh-finds-settings__toggle-label', isPushMode)}
              >
                {text.maxPapers}
              </label>
              <Form.Item
                name="maximumPapersPerDeposit"
                className="fresh-finds-settings__max-field"
                dependencies={['integrationMode']}
                rules={pushFieldRules(text.maxPapersRequired)}
              >
                <InputNumber
                  id="fresh-finds-max-papers"
                  className="fresh-finds-settings__max-input"
                  min={1}
                  controls={false}
                  aria-label={text.maxPapers}
                  aria-required={isPushMode}
                />
              </Form.Item>
            </div>
          </fieldset>

          {/*left*/}
          <div className="fresh-finds-settings__column">
            <span className="fresh-finds-settings__label">
              {text.depositMechanism}
            </span>
            <SettingsSelect
              name="repositoryProfile"
              placeholder={text.repositoryProfile}
              options={text.repositoryProfiles}
              rules={requiredRules(text.repositoryProfileRequired)}
            />
            <SettingsSelect
              name="integrationMode"
              placeholder={text.depositType}
              options={text.depositTypes}
              rules={requiredRules(text.depositTypeRequired)}
            />

            {/* TODO: re-enable when email notifications are available */}
            <SettingsSwitch
              name="notifyByEmail"
              id="fresh-finds-notify-email"
              label={text.notifyByEmail}
              disabled
            />
            <SettingsSwitch
              name="depositOnlyWithFullText"
              id="fresh-finds-full-text"
              label={text.fullTextOnly}
            />
          </div>

          {/*right*/}
          <fieldset className="fresh-finds-settings__column" disabled={isPullMode}>
            <span className={withRequiredClass('fresh-finds-settings__label', isPushMode)}>
              {text.swordEndpoint}
            </span>
            <Form.Item
              name="swordUsername"
              className="fresh-finds-settings__field"
              dependencies={['integrationMode']}
              rules={pushFieldRules(text.usernameRequired)}
            >
              <Input
                placeholder={text.username}
                aria-label={text.username}
                aria-required={isPushMode}
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name="swordPassword"
              className="fresh-finds-settings__field"
              dependencies={['integrationMode']}
              rules={pushFieldRules(text.passwordRequired, true)}
            >
              <Input.Password
                placeholder={text.password}
                aria-label={text.password}
                aria-required={isPushMode && !passwordConfigured}
                autoComplete="new-password"
              />
            </Form.Item>
            {passwordConfigured && (
              <p className="fresh-finds-settings__hint">{text.passwordConfigured}</p>
            )}
            <Form.Item
              name="swordEndpointUrl"
              className="fresh-finds-settings__field"
              dependencies={['integrationMode']}
              rules={pushFieldRules(text.swordUrlRequired)}
            >
              <Input
                placeholder={text.swordUrl}
                aria-label={text.swordUrl}
                aria-required={isPushMode}
                autoComplete="off"
              />
            </Form.Item>
            <div
              className="fresh-finds-settings__pull-alert"
            >
                <span>
                  {text.pullNotice}{' '}
                  <Markdown
                    className="fresh-finds-settings__doc-link"
                  >
                    {text.pullLink}
                  </Markdown>
                </span>
            </div>
          </fieldset>
        </div>
        <div className="fresh-finds-settings__actions">
          {isSaved && (
            <span className="fresh-finds-settings__saved" role="status">
              <CheckCircleOutlined className="fresh-finds-settings__saved-icon" aria-hidden />
              {text.saveSuccess}
            </span>
          )}
          <Button type="primary" htmlType="submit" loading={isSaving} aria-label={text.save}>
            {text.save}
          </Button>
        </div>
      </Form>
    </ConfigProvider>
  );
};
