import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { CrPaper, Markdown } from '@oacore/core-ui';
import { LogoUpload } from './Upload.tsx';
import { useUpdateLogo } from '@features/Settings/RepositorySettings/hooks/useUpdateLogo.ts';
import notificationText from '@features/Settings/texts';
import '../styles.css';

const UPLOAD_SECTION_ID = 'upload-section';

interface UploadSectionProps {
  className?: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  className,
}) => {
  const { updateLogo, logoUrl } = useUpdateLogo();
  const [searchParams] = useSearchParams();
  const uploadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get('referrer') === 'upload' && uploadRef.current) {
      uploadRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  return (
    <div id={UPLOAD_SECTION_ID} ref={uploadRef}>
      <CrPaper
        className={classNames('access-users-section', className)}
        aria-label={notificationText.upload.title}
      >
        <div className="header-wrapper">
          <h2 className="header-wrapper-title">{notificationText.upload.title}</h2>
        </div>
        <div className="upload-container">
          <div className="upload-description">
            <Markdown className="upload-description-text">{notificationText.upload.description}</Markdown>
          </div>
          <div className="upload-wrapper">
            <LogoUpload
              deleteCaption={notificationText.upload.deleteCaption}
              logoUrl={logoUrl}
              imageCaption={notificationText.upload.imageCaption}
              buttonCaptions={notificationText.upload.buttonCaptions}
              onSubmit={updateLogo}
            />
          </div>
        </div>
      </CrPaper>
    </div>
  );
};

