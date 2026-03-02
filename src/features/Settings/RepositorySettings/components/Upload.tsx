import React, { useState, useEffect } from 'react';
import { Button, Upload } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import type { UploadProps as AntUploadProps, RcFile } from 'antd/es/upload';
import classNames from 'classnames';
import placeholderImage from '@/assets/icons/placeholderImage.svg';
import '../styles.css';

interface LogoUploadProps {
  buttonCaptions: {
    upload: string;
    change: string;
    save: string;
  };
  imageCaption?: string;
  deleteCaption: string;
  logoUrl?: string;
  onSubmit: (body: { logoBase64: string | null }) => Promise<void>;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  buttonCaptions,
  imageCaption,
  deleteCaption,
  logoUrl: initialLogo,
  onSubmit,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [hasImageError, setHasImageError] = useState(false);

  const hasValidLogo = initialLogo && typeof initialLogo === 'string' && initialLogo.trim() !== '';
  const displayImage = preview || initialLogo || placeholderImage;
  const isActiveImage = (!!preview || hasValidLogo) && !hasImageError;
  const hasExistingLogo = hasValidLogo && !preview;

  const handleFileRead = (file: File): void => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result as string);
      setHasImageError(false);
    };

    reader.onerror = () => {
      console.error('Error reading file');
    };
  };

  const handleFileChange = (file: RcFile): boolean => {
    handleFileRead(file);
    return false;
  };

  const handleReset = async (): Promise<void> => {
    if (window.confirm(deleteCaption)) {
      await onSubmit({ logoBase64: null });
      setPreview(null);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!preview) return;
    await onSubmit({ logoBase64: preview });
    setPreview(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.src = placeholderImage;
    setHasImageError(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleReset();
    }
  };

  useEffect(() => {
    setHasImageError(false);
  }, [initialLogo]);

  const uploadProps: AntUploadProps = {
    name: 'file',
    accept: 'image/*',
    beforeUpload: handleFileChange,
    showUploadList: false,
    multiple: false,
  };

  return (
    <div className="container">
      <div
        className={classNames('image', {
          'image-preview': isActiveImage,
        })}
      >
        {isActiveImage && (
          <button
            type="button"
            onClick={handleReset}
            className="delete"
            aria-label="Delete logo"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <CloseOutlined />
          </button>
        )}
        <img
          src={displayImage}
          alt="Logo"
          className="logo"
          onError={handleImageError}
        />
      </div>
      {imageCaption && <span className="caption">{imageCaption}</span>}
      {preview ? (
        <Button type="primary" onClick={handleSubmit} className="action">
          {buttonCaptions.save}
        </Button>
      ) : (
        <Upload {...uploadProps}>
          <Button type={hasExistingLogo ? 'primary' : 'default'} className="action">
            {hasExistingLogo ? buttonCaptions.change : buttonCaptions.upload}
          </Button>
        </Upload>
      )}
    </div>
  );
};


