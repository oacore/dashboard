import { AccessUsers } from './AccessUsers';
import { useState } from 'react';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import notificationText from '@features/Settings/texts';
import "../styles.css"

export const AccessCards = () => {
  const {
    apiUsersData,
    datasetUsersData,
  } = useOrganisation();
  const [showFullApiList, setShowFullApiList] = useState(false);
  const [showFullDatasetList, setShowFullDatasetList] = useState(false);

  const toggleApiList = () => {
    setShowFullApiList(!showFullApiList);
  };

  const toggleDatasetList = () => {
    setShowFullDatasetList(!showFullDatasetList);
  };

  return (
    <>
      <AccessUsers
        title={notificationText.accessUsers.title}
        subTitle={
          <div>
            {`There are `}
            <span className="highlite">{apiUsersData.length}</span>
            {` people at your organisation registered for `}
            <a
              href="https://core.ac.uk/services/api"
              target="_blank"
              rel="noreferrer"
            >
              CORE API
            </a>
          </div>
        }
        subDescription={notificationText.accessUsers.subTitle}
        userData={apiUsersData}
        toggleShowFullList={toggleApiList}
        showFullList={showFullApiList}
      />
      <AccessUsers
        title={notificationText.accessDataUsers.title}
        subTitle={
          <div>
            {`There are `}
            <span className="highlite">
              {datasetUsersData.length}
            </span>
            {` people at your organisation registered for `}
            <a
              href="https://core.ac.uk/services/dataset"
              target="_blank"
              rel="noreferrer"
            >
              CORE Dataset
            </a>
          </div>
        }
        subDescription={notificationText.accessDataUsers.subTitle}
        userData={datasetUsersData}
        toggleShowFullList={toggleDatasetList}
        showFullList={showFullDatasetList}
      />
    </>
  )
}
