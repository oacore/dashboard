import { Button } from 'antd';
import classNames from 'classnames';
import { CrPaper } from '@oacore/core-ui';
import "../styles.css"

export interface AccessUserItem {
  person?: string;
  email?: string;
  description?: string;
  [key: string]: unknown;
}

interface AccessUsersProps {
  className?: string;
  title: string;
  subTitle: React.ReactNode;
  subDescription: string;
  userData: AccessUserItem[];
  toggleShowFullList: () => void;
  showFullList: boolean;
}

export const AccessUsers = ({
  className,
  title,
  subTitle,
  subDescription,
  userData,
  toggleShowFullList,
  showFullList,
}: AccessUsersProps) => {

  const displayAllUsers = showFullList ? userData : userData.slice(0, 2);

  return (
    <CrPaper className={classNames('access-users-section', className)}>
      <div className="form-wrapper">
        <div className="form-inner-wrapper">
          <div className="access-header-wrapper">
            <h2 className="header-wrapper-title">{title}</h2>
          </div>
          {subTitle && <div className="access-users-subtitle">{subTitle}</div>}
          <div className="user-main-wrapper">
            {displayAllUsers.map((item, index) => (
              <div key={`user-${index}`} className="user-wrapper">
                <div className="user">
                  <div className="access-user-name">
                    {item.person ? item.person : 'Not available.'}
                  </div>
                  <div className="access-user-name">
                    {item.email ? item.email : 'Not available.'}
                  </div>
                </div>
                <p className="sub-title">{subDescription}</p>
                <div className="additional-info">
                  {item.description ? item.description : 'Not available.'}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="main-warning-wrapper" />
      </div>
      {userData.length > 2 && (
        <Button
          className="show-btn"
          type="default"
          onClick={toggleShowFullList}
        >
          {showFullList ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </CrPaper>
  );
};

