import { forwardRef } from 'react';

import coreLogo from '@/assets/img/fairCertificateCoreLogo.svg';
import certificateSealBronze from '@/assets/img/fairCertificateSealBrone.svg';
import certificateSealSilver from '@/assets/img/fairCertificateSealSilver.svg';
import certificateSealGold from '@/assets/img/fairCertificateSealGold.svg';
import fairTexts from '@features/Fair/texts/fair.json';
import type {
  FairCertificationApiCertificate,
  FairCertificationLevel,
} from '@features/Fair/types/fairCertification.types';
import { processTemplate } from '@/utils/helpers';

const CERTIFICATE_SEAL_BY_LEVEL: Record<FairCertificationLevel, string> = {
  bronze: certificateSealBronze,
  silver: certificateSealSilver,
  gold: certificateSealGold,
  platinum: certificateSealGold,
};

const getCertificateSeal = (level?: FairCertificationLevel | null): string => {
  if (!level) {
    return certificateSealBronze;
  }

  return CERTIFICATE_SEAL_BY_LEVEL[level.toLowerCase() as FairCertificationLevel] ?? certificateSealBronze;
};

export type FairCertificateViewProps = {
  certificationData?: FairCertificationApiCertificate | null;
};

export const FairCertificateView = forwardRef<HTMLDivElement, FairCertificateViewProps>(
  ({ certificationData }, ref) => {
    const { certificate } = fairTexts;
    const certificateDescription = processTemplate(certificate.description, {
      level: certificationData?.level ?? '',
    });
    const certificateSeal = getCertificateSeal(certificationData?.level);

    return (
      <div
        ref={ref}
        className="fair-certificate"
      >
        <div className="fair-certificate__card">
          <span className="fair-certificate__frame fair-certificate__frame--top-left" aria-hidden="true" />
          <span className="fair-certificate__frame fair-certificate__frame--top-right" aria-hidden="true" />
          <span className="fair-certificate__frame fair-certificate__frame--bottom-left" aria-hidden="true" />
          <span className="fair-certificate__frame fair-certificate__frame--bottom-right" aria-hidden="true" />

          <span className="fair-certificate__edge fair-certificate__edge--top" aria-hidden="true" />
          <span className="fair-certificate__edge fair-certificate__edge--bottom" aria-hidden="true" />
          <span className="fair-certificate__edge fair-certificate__edge--left" aria-hidden="true" />
          <span className="fair-certificate__edge fair-certificate__edge--right" aria-hidden="true" />

          <span className="fair-certificate__frame fair-certificate__frame--inner fair-certificate__frame--top-left" aria-hidden="true" />
          <span className="fair-certificate__frame fair-certificate__frame--inner fair-certificate__frame--top-right" aria-hidden="true" />
          <span className="fair-certificate__frame fair-certificate__frame--inner fair-certificate__frame--bottom-left" aria-hidden="true" />
          <span className="fair-certificate__frame fair-certificate__frame--inner fair-certificate__frame--bottom-right" aria-hidden="true" />


          <div className="fair-certificate__content">
            <header className="fair-certificate__header">
              <h2 className="fair-certificate__title">{certificate.title}</h2>
              <p className="fair-certificate__level">{certificationData?.level}</p>
              <p className="fair-certificate__presented-label">{certificate.presentedLabel}</p>
            </header>

            <h3 className="fair-certificate__recipient">{certificationData?.repositoryName}</h3>

            <p className="fair-certificate__description">{certificateDescription}</p>

            <footer className="fair-certificate__footer">
              <div className="fair-certificate__signatory">
                <p className="fair-certificate__footer-name">{certificationData?.certificateId}</p>
                <p className="fair-certificate__footer-title">{certificate.signatoryTitle}</p>
                <img
                  className="fair-certificate__core-logo"
                  src={coreLogo}
                  alt=""
                  width={32}
                  height={18}
                />
              </div>

              <div className="fair-certificate__seal-block">
                <img
                  className="fair-certificate__seal"
                  src={certificateSeal}
                  alt=""
                  width={88}
                  height={96}
                />
              </div>

              <div className="fair-certificate__dates">
                <p className="fair-certificate__issue-date">
                  <span className="fair-certificate__footer-name">{certificate.issueDateLabel}</span>
                  <span className="fair-certificate__footer-title">{certificationData?.issueDate}</span>
                </p>
                <p className="fair-certificate__valid-until">
                  {certificate.validUntilLabel}{certificationData?.validUntil}
                </p>
              </div>
            </footer>
            <p className="fair-certificate__info-url">{certificate.infoUrl}{certificationData?.certificateUrl}</p>
          </div>
        </div>
      </div>
    );
  });

FairCertificateView.displayName = 'FairCertificateView';
