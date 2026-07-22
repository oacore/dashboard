import { useDocumentTitle } from '@hooks/useDocumentTitle.ts';
import { useState, useEffect, useCallback } from 'react';
import { FairFeature, type FairCertificationData } from '@features/Fair/Fair.tsx';
import { ApprovedFairView } from '@features/Fair/components/ApprovedFairView.tsx';
import { useFairCertification } from '@features/Fair/hooks/useFairCertification';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import { useStartingOrSupportingBillingPlanData } from '@features/Orcid/hooks/useStartingOrSupportingBillingPlanData';
import { useDataProviderStore } from '@/store/dataProviderStore';
import fairCertificationLanding from '@features/Fair/texts/fairCertificationLanding.json';

const FAIR_REGISTER_INTEREST_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScVAzXyEoPNBno9qorv2pQU9QmUalagtcoRn9Tze4V5TQZ1Pw/viewform?usp=dialog';

const SUCCESS_MESSAGE_DURATION_MS = 5000;
// TODO temp show
const APPROVED_FAIR_VIEW_DATA_PROVIDER_IDS = [1, 86] as const;

const fairCertificationData = fairCertificationLanding as FairCertificationData;

const canAccessApprovedFairView = (dataProviderId?: number): boolean =>
  dataProviderId != null &&
  (APPROVED_FAIR_VIEW_DATA_PROVIDER_IDS as readonly number[]).includes(dataProviderId);

export function FAIRCertificationPage() {
  useDocumentTitle('FAIR Certification');
  const { fairCertification } = useFairCertification();
  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();
  const { isStartingOrSupportingPlan } = useStartingOrSupportingBillingPlanData([], organisation);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dataProviderId = selectedDataProvider?.id;

  const handleRegisterInterest = useCallback(() => {
    setShowSuccessMessage(true);
  }, []);

  useEffect(() => {
    if (!showSuccessMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, SUCCESS_MESSAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  if (canAccessApprovedFairView(dataProviderId) && !showSuccessMessage) {
    return <ApprovedFairView certificationQuestions={fairCertification} />;
  }

  return (
    <FairFeature
      data={fairCertificationData}
      showSuccessMessage={showSuccessMessage}
      registerInterestHref={isStartingOrSupportingPlan ? FAIR_REGISTER_INTEREST_FORM_URL : undefined}
      onRegisterInterest={isStartingOrSupportingPlan ? undefined : handleRegisterInterest}
    />
  );
}
