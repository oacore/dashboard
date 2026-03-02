import classNames from 'classnames';
import { Button } from 'antd';
import { patchValue } from '@utils/helpers';
import type { MembershipTextData, MembershipAction } from '../types/text.types';
import '../styles.css';

interface MembershipCardProps {
  title: string;
  textData: MembershipTextData;
  isPlanActive: boolean;
  description: string;
  action?: MembershipAction;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  title,
  textData,
  isPlanActive,
  description,
  action,
}) => (
  <div className="membership-card">
    <h1
      className={classNames('membership-card-title', {
        'membership-card-title-active': isPlanActive,
      })}
    >
      {title}
      {isPlanActive && <span>{textData.plans.selected.header}</span>}
    </h1>
    <div
      className={classNames('membership-card-content', {
        'membership-card-content-active': isPlanActive,
      })}
    >
      <p className="membership-card-description">{description}</p>
      {isPlanActive ? (
        <p className="membership-plan-active">
          {patchValue(textData.plans.selected.card, { title })}
        </p>
      ) : (
        action && (
          <Button
            type="primary"
            href={action.url}
            className="membership-card-button"
          >
            {action.caption}
          </Button>
        )
      )}
    </div>
  </div>
);

export default MembershipCard;
