import { CrHeader, CrPaper, CrShowMore, TextBox } from '@oacore/core-ui';
import { MembershipCard } from '@features/Membership/components';
import { TextData } from '@features/Membership/texts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import './styles.css';

const getDefaultPlanName = (): string => {
  const defaultCard = TextData.plans.cards.find((card) => card.default);
  return defaultCard ? defaultCard.title.toLowerCase() : 'starting';
};

export const MembershipTypeFeature = () => {
  const { organisation } = useOrganisation();
  const billingTypeRaw = organisation?.billingPlan?.billingType?.trim();
  const planName =
    billingTypeRaw && billingTypeRaw.length > 0
      ? billingTypeRaw.toLowerCase()
      : getDefaultPlanName();

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
      </CrPaper>
    </div>
  );
};

