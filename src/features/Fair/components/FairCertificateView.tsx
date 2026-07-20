import coreLogo from '@/assets/img/fairCertificateCoreLogo.svg';
import certificateSeal from '@/assets/img/fairCertificateSeal.svg';
import fairTexts from '@features/Fair/texts/fair.json';
import type { FairCertificationApiCertificate } from '@features/Fair/types/fairCertification.types';

export type FairCertificateViewProps = {
  certificationData?: FairCertificationApiCertificate | null;
};


export const FairCertificateView = ({
  certificationData,
}: FairCertificateViewProps) => {
  const { certificate } = fairTexts;

  return (
    <div
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

          <p className="fair-certificate__description">{certificate.description}</p>

          <footer className="fair-certificate__footer">
            <div className="fair-certificate__signatory">
              <p className="fair-certificate__footer-name">{certificate.signatoryName}</p>
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
          <p className="fair-certificate__info-url">{certificate.infoUrl}</p>
        </div>
      </div>
    </div>
  );
};
