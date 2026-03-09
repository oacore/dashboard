import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Switch, Button, message } from 'antd';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { CrPaper } from '@core/core-ui';
import { CrInput } from '@core/core-ui';
import { Markdown } from '@core/core-ui';
import { useOaiMapping } from '../hooks/useOaiMapping';
import notificationText from '@features/Settings/texts';
import '../styles.css';
import oaiImg from '@/assets/icons/oailogo.svg';

const OAI_MAPPING_SECTION_ID = 'oai-mapping-section';

interface OaiMappingProps {
  className?: string;
}

export const OaiMapping: React.FC<OaiMappingProps> = ({ className }) => {
  const [searchParams] = useSearchParams();
  const oaiMappingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get('referrer') === 'mapping' && oaiMappingRef.current) {
      oaiMappingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);
  const { oaiMapping, updateOaiSettings } = useOaiMapping();
  const [form] = Form.useForm();
  const content = notificationText.mapping;
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlValue, setUrlValue] = useState<string>('');
  const activatedValue = Form.useWatch('activated', form);

  // Initialize form values when data loads
  useEffect(() => {
    if (oaiMapping && Object.keys(oaiMapping).length > 0) {
      const initialUrlMapping = oaiMapping.urlMapping || '';
      const initialActivated = oaiMapping.activated || false;

      form.setFieldsValue({
        oaiPrefix: oaiMapping.oaiPrefix || '',
        urlMapping: initialUrlMapping,
        activated: initialActivated,
      });

      setUrlValue(initialUrlMapping);
    }
  }, [oaiMapping, form]);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = useCallback(async (values: {
    oaiPrefix?: string;
    urlMapping?: string;
    activated?: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await updateOaiSettings({
        urlMapping: values.urlMapping || urlValue || oaiMapping?.urlMapping || '',
        activated: values.activated ?? oaiMapping?.activated ?? false,
      });

      if (result.type === 'success') {
        setShowSuccess(true);
        message.success(result.message);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting OAI mapping:', error);
      message.error('Failed to update OAI mapping settings');
    } finally {
      setIsSubmitting(false);
    }
  }, [updateOaiSettings, urlValue, oaiMapping?.activated, oaiMapping?.urlMapping]);

  const handleSwitchChange = useCallback(async (checked: boolean) => {
    form.setFieldValue('activated', checked);
    // Auto-submit when switch changes
    const values = form.getFieldsValue();
    await handleSubmit({
      urlMapping: values.urlMapping || urlValue,
      activated: checked
    });
  }, [form, handleSubmit, urlValue]);

  const handleUrlMappingChange = useCallback((value: string) => {
    setUrlValue(value);
    form.setFieldValue('urlMapping', value);
  }, [form]);

  const hasMappingData = oaiMapping && Object.keys(oaiMapping).length > 0;

  return (
    <div id={OAI_MAPPING_SECTION_ID} ref={oaiMappingRef}>
      <CrPaper className={classNames('access-users-section', className)}>
        <div className="form-wrapper">
          <div className="form-inner-wrapper">
            <img className="oai-img" src={oaiImg} alt="" />
            <div className="header-wrapper">
              <h2 className="header-wrapper-title">{content.title}</h2>
            </div>
            <Markdown className="oa-description">
              {content.description}
            </Markdown>
            {hasMappingData ? (
              <Form
                form={form}
                name="oaiMapping"
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  oaiPrefix: oaiMapping.oaiPrefix || '',
                  urlMapping: oaiMapping.urlMapping || '',
                  activated: oaiMapping.activated || false,
                }}
              >
                {content.form.map((field) => {
                  const isUrlMapping = field.name === 'urlMapping';
                  return (
                    <div key={field.name} className="mapping-field-wrapper">
                      <Form.Item
                        label={field.title}
                        name={field.name}
                        className="mapping-label"
                      >
                        <CrInput
                          id={field.name}
                          name={field.name}
                          value={isUrlMapping ? urlValue : undefined}
                          onChange={isUrlMapping ? handleUrlMappingChange : undefined}
                          placeholder={!oaiMapping[field.name] ? field.label : undefined}
                          disabled={field.disabled}
                          label={!oaiMapping[field.name] ? field.label : undefined}
                        />
                      </Form.Item>
                      {field.helper && (
                        <div className="mapping-helper">{field.helper}</div>
                      )}
                    </div>
                  );
                })}

                <div className="mapping-switch-wrapper">
                  <Form.Item name="activated" valuePropName="checked" noStyle>
                    <Switch
                      checked={activatedValue ?? oaiMapping?.activated ?? false}
                      onChange={handleSwitchChange}
                      className="mapping-switch"
                    />
                  </Form.Item>
                  <span className="mapping-switch-label">
                    {(activatedValue ?? oaiMapping?.activated ?? false)
                      ? content.switch.active
                      : content.switch.disabled}
                  </span>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    className="mapping-submit-button"
                  >
                    {content.buttonCaption}
                  </Button>
                </Form.Item>
                {showSuccess && (
                  <div className="success">
                    Settings were updated successfully!
                  </div>
                )}
              </Form>
            ) : null}
          </div>
          <div className="main-warning-wrapper" />
        </div>
      </CrPaper>
    </div>
  );
};

