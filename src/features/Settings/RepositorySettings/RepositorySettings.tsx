import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import {useSets} from '@features/Settings/RepositorySettings/hooks/useSets.ts';
import {useLicencing} from '@features/Settings/RepositorySettings/hooks/useLicencing.ts';
import { useOaiMapping } from './hooks/useOaiMapping';
import {Repository} from '@features/Settings/RepositorySettings/components/Repository.tsx';
import {OaiMapping} from '@features/Settings/RepositorySettings/components/OaiMapping.tsx';
import {Licencing} from '@features/Settings/RepositorySettings/components/Licencing.tsx';
import {UploadSection} from '@features/Settings/RepositorySettings/components/UploadSection.tsx';
import {Sets} from '@features/Settings/RepositorySettings/components/Sets.tsx';

export function RepositoryFeature() {
  const { isLoading: isLoadingDataProvider } = useDataProviderStore();
  const { isLoading: isLoadingOaiMapping } = useOaiMapping();
  const { isLoading: isLoadingLicencing } = useLicencing();
  const { isLoadingOrganisation } = useOrganisation();
  const { selectedDataProvider } = useDataProviderStore();
  const {
    enabledList,
  } = useSets();

  const isLoading = isLoadingDataProvider || isLoadingOaiMapping || isLoadingLicencing || isLoadingOrganisation;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title">Repository Settings</h1>
      <Repository />
      {(enabledList.length > 0 && selectedDataProvider?.id === 140) && <Sets />}
      <OaiMapping />
      <Licencing />
      <UploadSection />
    </div>
  );
}
