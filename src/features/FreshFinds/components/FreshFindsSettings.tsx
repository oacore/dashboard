import { useEffect } from 'react';
import { Alert, Button, Checkbox, ConfigProvider, Form, Input, InputNumber, Radio, Select, Spin, Switch, message } from 'antd';
import type { FormItemProps, ThemeConfig } from 'antd';

import { customColors } from '@/config/theme';

import { useFreshFindsSettings } from '../hooks/useFreshFindsSettings';
import { useFreshFindsStore } from '../store/freshFindsStore';
import { articleTemplateData } from '../texts';
import type { FreshFindsSettingsFormValues, FreshFindsSettingsSources } from '../types/settings.types';
import {
  getIncompleteSettingsFields,
  type FreshFindsRequiredField,
} from '../utils/settingsValidation';
import {Markdown} from '@oacore/core-ui';
import '../FreshFindsFeature.css';

const text = articleTemplateData.settings;

type SettingsFormState = FreshFindsSettingsFormValues & {
  sourcesSelection?: string;
};

const sourceFieldDependencies = text.sources.map(
  (source) => ['sources', source.id] as ['sources', keyof FreshFindsSettingsSources],
);

const pushFieldNames = [
  'depositFrequency',
  'maximumPapersPerDeposit',
  'swordUsername',
  'swordPassword',
  'swordEndpointUrl',
] as const;

const getSettingsLabelClassName = (isRequired: boolean) =>
  isRequired
    ? 'fresh-finds-settings__label fresh-finds-settings__label--required'
    : 'fresh-finds-settings__label';

const getMaxPapersLabelClassName = (isRequired: boolean) =>
  isRequired
    ? 'fresh-finds-settings__toggle-label fresh-finds-settings__label--required'
    : 'fresh-finds-settings__toggle-label';

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
  const [form] = Form.useForm<SettingsFormState>();
  const { formValues, passwordConfigured, error, isLoading, isSaving, saveSettings } = useFreshFindsSettings();
  const settingsAttentionRequestId = useFreshFindsStore((state) => state.settingsAttentionRequestId);
  const integrationMode = Form.useWatch('integrationMode', form);
  const resolvedIntegrationMode = integrationMode ?? formValues?.integrationMode;
  const isPullMode = resolvedIntegrationMode === 'pull';
  const isPushMode = resolvedIntegrationMode === 'push';
  const isFormReady = !(isLoading && !formValues);

  const createFieldRules = (
    field: FreshFindsRequiredField,
    messageText: string,
  ): FormItemProps['rules'] => [
    {
      validator: async () => {
        const values = form.getFieldsValue(true) as FreshFindsSettingsFormValues;
        const missing = getIncompleteSettingsFields(values, passwordConfigured);

        if (missing.includes(field)) {
          throw new Error(messageText);
        }
      },
    },
  ];

  useEffect(() => {
    if (!isFormReady || isPushMode) {
      return;
    }

    form.setFields(pushFieldNames.map((name) => ({ name, errors: [] })));
  }, [form, isFormReady, isPushMode]);

  useEffect(() => {
    if (!isFormReady || settingsAttentionRequestId === 0) {
      return;
    }

    void form.validateFields().catch(() => undefined);
  }, [form, isFormReady, settingsAttentionRequestId]);

  const handleSave = async (values: SettingsFormState) => {
    try {
      await saveSettings(values);
      form.setFieldValue('swordPassword', '');
      message.success(text.saveSuccess);
    } catch {
      message.error(text.saveError);
    }
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
        initialValues={{ ...(formValues ?? EMPTY_FORM), sourcesSelection: '' }}
        onFinish={handleSave}
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
              className={getSettingsLabelClassName(true)}
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
            <Form.Item
              className="fresh-finds-settings__sources-error"
              name="sourcesSelection"
              dependencies={sourceFieldDependencies}
              rules={createFieldRules('sources', text.sourcesRequired)}
            >
              <Input className="fresh-finds-settings__hidden-input" tabIndex={-1} aria-hidden />
            </Form.Item>

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
              className={getSettingsLabelClassName(isPushMode)}
            >
              {text.depositFrequencyLabel}
            </span>
            <Form.Item
              name="depositFrequency"
              className="fresh-finds-settings__frequency-item"
              rules={createFieldRules('depositFrequency', text.depositFrequencyRequired)}
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
                className={getMaxPapersLabelClassName(isPushMode)}
              >
                {text.maxPapers}
              </label>
              <Form.Item
                name="maximumPapersPerDeposit"
                className="fresh-finds-settings__max-field"
                rules={createFieldRules('maximumPapersPerDeposit', text.maxPapersRequired)}
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
              rules={createFieldRules('repositoryProfile', text.repositoryProfileRequired)}
            />
            <SettingsSelect
              name="integrationMode"
              placeholder={text.depositType}
              options={text.depositTypes}
              rules={createFieldRules('integrationMode', text.depositTypeRequired)}
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
            <span className={getSettingsLabelClassName(isPushMode)}>
              {text.swordEndpoint}
            </span>
            <Form.Item
              name="swordUsername"
              className="fresh-finds-settings__field"
              rules={createFieldRules('swordUsername', text.usernameRequired)}
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
              rules={createFieldRules('swordPassword', text.passwordRequired)}
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
              rules={createFieldRules('swordEndpointUrl', text.swordUrlRequired)}
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
          <Button type="primary" htmlType="submit" loading={isSaving} aria-label={text.save}>
            {text.save}
          </Button>
        </div>
      </Form>
    </ConfigProvider>
  );
};
