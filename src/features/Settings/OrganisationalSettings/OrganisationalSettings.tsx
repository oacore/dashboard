import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { OrganisationCard } from '@features/Settings/OrganisationalSettings/components/OrganisationCard.tsx';
import { AccessCards } from '@features/Settings/OrganisationalSettings/components/AccessCards.tsx';
import { ChangePassword } from '@components/common/ChangePassword';
import { useCurrentUser } from '@hooks/useUser.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';

export function OrganisationalFeature() {
  const { data, isLoading: isLoadingUser } = useCurrentUser();
  const {
    isLoadingOrganisation,
    isLoadingApiUsers,
    isLoadingDatasetUsers,
  } = useOrganisation();

  const isLoading = isLoadingUser || isLoadingOrganisation || isLoadingApiUsers || isLoadingDatasetUsers;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">Organisational settings</h1>
      <OrganisationCard />
      <AccessCards />
      <ChangePassword
        className={"section"}
        email={data?.email}
      />
    </div>
  );
}
