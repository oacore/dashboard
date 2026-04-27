import {CrFeatureLayout, CrPaper} from '@oacore/core-ui';
import '../styles.css';

import {FairDocHeader} from '@features/Fair/components/FairDocHeader.tsx';
import {FairPrinciplesCollapse} from '@features/Fair/components/FairPrinciplesCollapse.tsx';
import {FairSubmissionProgress} from '@features/Fair/components/FairSubmissionProgress.tsx';
import { useDataProviderStore } from '@/store/dataProviderStore';
import { useRioxxStats } from '@features/Validator/hooks/useRioxxStats';
import { useUsrnData } from '@features/Usrn/hooks/useUsrnData';
import { useIrusStats } from '@/hooks/useIrusStats';
import { useDataProviderStatistics } from '@/hooks/useDataProviderStatistics';
import { useDoiStatistics } from '@features/Doi/hooks/useDoiStatistics';
import type { FairRepositoryStatusParams } from '@features/Fair/utils/resolveFairQuestionStatus';

export const ApprovedFairView = () => {
  const { selectedDataProvider, selectedSetSpec, statistics, doiStatistics } = useDataProviderStore();
  const rorId = selectedDataProvider?.rorData?.rorId ?? null;
  const { rioxx } = useRioxxStats(selectedDataProvider?.id);
  const { usrnData } = useUsrnData(selectedDataProvider?.id);
  const { irus } = useIrusStats(selectedDataProvider?.id);

  useDataProviderStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);
  useDoiStatistics(selectedDataProvider?.id ?? null, selectedSetSpec);

  const repositoryStatus: FairRepositoryStatusParams = {
    rioxx: rioxx ?? undefined,
    statistics: statistics ?? undefined,
    internalStatistics:
      statistics != null || doiStatistics != null
        ? {
            fullTextCount: statistics?.countFulltext,
            metadataCount: statistics?.countMetadata,
            doiCount: doiStatistics?.dataProviderDoiCount,
          }
        : undefined,
    usrn: usrnData ?? null,
    irus,
    rorId,
  };

  return (
    <CrFeatureLayout>
      <CrPaper>
        <FairDocHeader/>
        <FairPrinciplesCollapse repositoryStatus={repositoryStatus} />
        <FairSubmissionProgress/>
      </CrPaper>
    </CrFeatureLayout>
  );
};
