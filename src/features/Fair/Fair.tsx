import {CrMessage, CrPaper, Markdown} from '@oacore/core-ui';
import { toAbsoluteAssetUrl } from '@/utils/contentUtils';
import success from '@/assets/icons/successFilledTick.svg';
import { FairCertificationFeesTable } from './FairCertificationFeesTable';
import { FairCertificationMembersFeesTable } from './FairCertificationMembersFeesTable';
import { parseFairPricingTable } from './fairPricingUtils';
import './styles.css';

export type { FairPricingTable, FairPricingPrice, FairPricingHeader, FairPricingSubRow, FairPricingPriceType } from './fairPricingTypes';

export type FairCertificationHowItWorks = {
  title: string;
  description: string;
  image: string;
};

export type FairCertificationStep = {
  step: number | string;
  title: string;
  description: string;
};

export type FairCertificationApplicationProcess = {
  title: string;
  steps: FairCertificationStep[];
};

export type FairCertificationCertificate = {
  title: string;
  picture: string;
  description: string;
};

/** Content API nests each section under a key matching the section name. */
export type FairCertificationData = {
  howItWorks: { howItWorks: FairCertificationHowItWorks };
  applicationProcess: { applicationProcess: FairCertificationApplicationProcess };

  certificates: { certificates: FairCertificationCertificate[] };
  table?: unknown;
  tableMembers?: unknown;
};

export type FairFeatureProps = {
  data: FairCertificationData;
};

export const FairFeature = ({ data }: FairFeatureProps) => {
  const howItWorks = data.howItWorks.howItWorks;
  const applicationProcess = data.applicationProcess.applicationProcess;
  const certificates = data.certificates.certificates;
  const bundle = data.table && typeof data.table === 'object' ? (data.table as Record<string, unknown>) : undefined;

  const feesTable =
    parseFairPricingTable(data.table) ?? parseFairPricingTable(bundle?.table);

  const membersTable =
    parseFairPricingTable(data.tableMembers) ?? parseFairPricingTable(bundle?.tableMembers);

  const howItWorksImageUrl = toAbsoluteAssetUrl(howItWorks.image);

  return (
    <CrPaper>
      <div className="fair-certification">
        <section className="fair-certification-intro" aria-labelledby="fair-how-title">
          <div>
            <div  className="fair-certification-intro-inner">
              <div  className="fair-certification-intro-badge-wrapper">
                <img
                  src={howItWorksImageUrl}
                  className="fair-certification-intro-badge"
                  alt=""
                />
              </div>
              <h2
                id="fair-how-title"
                className="fair-certification-intro-title certification-section-title fair-certification-section-title"
              >
                FAIR Repository Certification
              </h2>
              {/*TODO TEMP*/}
              <div className="header-label">Demo</div>
              <Markdown className="fair-certification-markdown fair-certification-intro-text">
                {howItWorks.description}
              </Markdown>
              <p className="fair-certification-intro-cta">
                <a
                  className="fair-certification-intro-read-more"
                  href={"https://core.ac.uk/services/fair-certification"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more about CORE FAIR Certification on our website.
                </a>
                <a
                  className="fair-certification-intro-register"
                  href={"https://docs.google.com/forms/d/e/1FAIpQLScVAzXyEoPNBno9qorv2pQU9QmUalagtcoRn9Tze4V5TQZ1Pw/viewform?usp=dialog"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register your interest
                </a>
                {/*TODO render based on view*/}
                <CrMessage
                  variant="success"
                  className="success-certification-intro-text"
                >
                  <img src={success} alt=""/>
                  Your request has been submitted. We will contact you as soon as possible to arrange the payment. After this you will get access to the FAIR certification report.
                </CrMessage>
              </p>
            </div>
          {/*  TODO enable based on condition */}
            {(feesTable || membersTable) && (
              <section
                className="fair-certification-pricing"
                aria-label="FAIR Certification fees and member pricing"
              >
                <div className="fair-certification-pricing-tables">
                  {feesTable ? <FairCertificationFeesTable config={feesTable} /> : null}
                  {membersTable ? <FairCertificationMembersFeesTable config={membersTable} /> : null}
                </div>
              </section>
            )}
          </div>
        </section>
        <section
          className="fair-certification-application"
          aria-labelledby="fair-application-title"
        >
          <h2
            id="fair-application-title"
            className="fair-certification-application-title certification-section-title fair-certification-section-title"
          >
            How to Get Started
          </h2>
          <div className="fair-certification-steps" role="list">
            {applicationProcess.steps.map((step, index) => (
              <div
                key={`step-${index}`}
                className="fair-certification-step"
                role="listitem"
              >
                <div className="fair-certification-step-track" aria-hidden>
                  <span className="fair-certification-step-num">
                    {step.step ?? index + 1}
                  </span>
                  <span className="fair-certification-step-track-line" />
                </div>
                <div className="fair-certification-step-content">
                  <h3 className="fair-certification-feature-title">{step.title}</h3>
                  <Markdown className="fair-certification-markdown fair-certification-step-markdown">
                    {step.description}
                  </Markdown>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="type" aria-labelledby="fair-cert-title">
          <h2 id="fair-cert-title" className="certification-section-title">
            CORE FAIR Repository Certificates
          </h2>
          <div className="certificate-item-wrapper">
            {certificates.map((cert, index) => (
              <article key={`cert-${index}`} className="certificate-item">
                <img className="cert-image" src={toAbsoluteAssetUrl(cert.picture)} alt="" width={80} height={80} />
                <h3 className="certification-title">{cert.title}</h3>
                <Markdown className="certification-markdown">{cert.description}</Markdown>
              </article>
            ))}
          </div>
        </section>
      </div>
    </CrPaper>
  );
};
