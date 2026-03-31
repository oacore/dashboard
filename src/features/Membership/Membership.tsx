import { CrHeader, CrPaper, CrShowMore, TextBox } from '@oacore/core-ui';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { MembershipCard } from '@features/Membership/components';
import { TextData } from '@features/Membership/texts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import './styles.css';

export const MembershipTypeFeature = () => {
  const { organisation, isLoadingOrganisation } = useOrganisation();
  const billingTypeRaw = organisation?.billingPlan?.billingType?.trim();
  const planName =
    billingTypeRaw && billingTypeRaw.length > 0
      ? billingTypeRaw.toLowerCase()
      : '';

  return (
    <div>
      <CrHeader
        title={TextData.title}
        showMore={
          <CrShowMore
            text={TextData.description}
            maxLetters={320}
          />
        }
      />
      <CrPaper className="membership-wrapper">
        {isLoadingOrganisation ? (
          <div
            className="membership-loading"
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading membership information"
          >
            <Spin indicator={<LoadingOutlined spin />} size="large" />
            <p className="membership-loading-text">Loading...</p>
          </div>
        ) : (
          <>
            <div className="membership-cards">
              {TextData.plans.cards.map((card) => (
                <MembershipCard
                  key={card.title}
                  title={card.title}
                  textData={TextData}
                  description={card.description}
                  action={card.action}
                  isPlanActive={planName === card.title.toLowerCase()}
                />
              ))}
            </div>
            <TextBox
              className="membership-box"
              description={TextData.box.text}
              buttonCaption={TextData.box.action.caption}
              buttonUrl={TextData.box.action.url}
            />
          </>
        )}
      </CrPaper>
    </div>
  );
};

