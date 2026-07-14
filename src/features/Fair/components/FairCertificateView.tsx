import coreLogo from '@/assets/img/fairCertificateCoreLogo.svg';
import certificateSeal from '@/assets/img/fairCertificateSeal.svg';

export type FairCertificateData = {
  title: string;
  level: string;
  presentedLabel: string;
  repositoryName: string;
  description: string;
  signatoryName: string;
  signatoryTitle: string;
  infoUrl: string;
  issueDateLabel: string;
  issueDate: string;
  validUntilLabel: string;
  validUntil: string;
};

export type FairCertificateViewProps = {
  data?: FairCertificateData;
};

const DUMMY_CERTIFICATE_DATA: FairCertificateData = {
  title: 'CERTIFICATE',
  level: 'BRONZE',
  presentedLabel: 'PROUDLY PRESENTED TO :',
  repositoryName: 'Open Research Online',
  description:
    "In recognition of the repository's demonstrated commitment to best practice data stewardship, attested by its compliance with the CORE FAIR Certification requirements at the Bronze level. This certificate signifies that the records managed herein meet the globally recognized standards for Findability, Accessibility, Interoperability, and Reusability (FAIR), ensuring long-term utility and transparency for the Open Access community.",
  signatoryName: 'Petr Knoth',
  signatoryTitle: 'CEO of CORE',
  infoUrl: 'For more information visit https://core.ac.uk/',
  issueDateLabel: 'Issue Date:',
  issueDate: '12/03/2023',
  validUntilLabel: 'Valid until:',
  validUntil: '12/03/2024',
};

export const FairCertificateView = ({
  data = DUMMY_CERTIFICATE_DATA,
}: FairCertificateViewProps) => {
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
            <h2 className="fair-certificate__title">{data.title}</h2>
            <p className="fair-certificate__level">{data.level}</p>
            <p className="fair-certificate__presented-label">{data.presentedLabel}</p>
          </header>

          <h3 className="fair-certificate__recipient">{data.repositoryName}</h3>

          <p className="fair-certificate__description">{data.description}</p>

          <footer className="fair-certificate__footer">
            <div className="fair-certificate__signatory">
              <p className="fair-certificate__footer-name">{data.signatoryName}</p>
              <p className="fair-certificate__footer-title">{data.signatoryTitle}</p>
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
                <span className="fair-certificate__footer-name">{data.issueDateLabel}</span>
                <span className="fair-certificate__footer-title">{data.issueDate}</span>
              </p>
              <p className="fair-certificate__valid-until">
                {data.validUntilLabel}{data.validUntil}
              </p>
            </div>
          </footer>
          <p className="fair-certificate__info-url">{data.infoUrl}</p>
        </div>
      </div>
    </div>
  );
};
