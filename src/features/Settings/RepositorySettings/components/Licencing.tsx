import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Select, Modal, Button } from 'antd';
import classNames from 'classnames';
import { CrPaper } from '@core/core-ui';
import { Markdown } from '@core/core-ui';
import { useLicencing } from '../hooks/useLicencing';
import notificationText from '@features/Settings/texts';
import '../styles.css';

const SUCCESS_MESSAGE_DURATION = 5000;

interface LicenseOption {
  type: number;
  value: string;
  description: string;
}

interface LicencingProps {
  className?: string;
}

export const Licencing: React.FC<LicencingProps> = ({ className }) => {
  const { licencingData, updateLicencing } = useLicencing();
  const content = notificationText.license;

  const [pendingOption, setPendingOption] = useState<LicenseOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Derive selected option from API data
  const selectedOption = useMemo(() => {
    if (!licencingData || !content.options) return null;
    return licencingData.licenseStrategy === false
      ? content.options[0]
      : content.options[1];
  }, [licencingData, content.options]);

  // Calculate license type boolean from option
  const getLicenseType = useCallback((option: LicenseOption): boolean => {
    return option.value !== content.options[0].value;
  }, [content.options]);


  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), SUCCESS_MESSAGE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleUpdateLicense = (option: LicenseOption) => {
    updateLicencing(getLicenseType(option))
      .then(() => {
        setShowSuccess(true);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Error updating license:', error);
      });
  };

  const handleSelectChange = (value: string) => {
    const option = content.options.find(opt => opt.value === value);
    if (!option) return;

    if (option.type === 1) {
      setPendingOption(option);
      setIsModalOpen(true);
    } else {
      handleUpdateLicense(option);
    }
  };

  const handleModalSave = () => {
    if (pendingOption) {
      handleUpdateLicense(pendingOption);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setPendingOption(null);
  };

  return (
    <div>
      <CrPaper className={classNames('access-users-section', className)}>
        <div className="form-wrapper">
          <div className="form-inner-wrapper">
            <div className="header-wrapper">
              <h2 className="header-wrapper-title">{content.title}</h2>
            </div>
            <div className="license-container">
              <div className="license-description-wrapper">
                <Markdown className="license-description">
                  {content.description}
                </Markdown>
                <div className="license-type-wrapper">
                  <div className="license-type">
                    {content.dropdown}
                  </div>
                  <div className="dropdown-wrapper">
                    <Select
                      value={selectedOption?.value}
                      onChange={handleSelectChange}
                      className="select-item"
                      placeholder="Select license type"
                      style={{ width: '100%' }}
                      options={content.options?.map((option) => ({
                        label: option.value,
                        value: option.value,
                      })) ?? []}
                    />
                  </div>
                </div>
                {selectedOption && (
                  <Markdown className="license-note">
                    {selectedOption.description}
                  </Markdown>
                )}
                {showSuccess && (
                  <div className="success">
                      Licencing preference updated successfully. It may take up to a week for the change to take effect.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="main-warning-wrapper" />
        </div>
      </CrPaper>

      <Modal
        closable={false}
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" type="text" onClick={handleModalCancel}>
            {content.modal.actions[1].title}
          </Button>,
          <Button key="save" type="primary" onClick={handleModalSave}>
            {content.modal.actions[0].title}
          </Button>,
        ]}
        className="licensing-modal"
        rootClassName="licensing-modal-root"
        centered
      >
        <div className="licensingguide">
          <h5 className="licensing-title">
            {content.modal.title}
          </h5>
          <div className="licensingguide-inner-wrapper">
            <Markdown className="licensing-description">
              {content.modal.description}
            </Markdown>
          </div>
        </div>
      </Modal>
    </div>
  );
};

