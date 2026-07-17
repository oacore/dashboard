import { useDocumentTitle } from '@hooks/useDocumentTitle.ts';
import { useState, useEffect, useRef, useCallback } from 'react';
import retrieveContent from '@/utils/retrieveContent';
import { FairFeature, type FairCertificationData } from '@features/Fair/Fair.tsx';
import { ApprovedFairView } from '@features/Fair/components/ApprovedFairView.tsx';
import { useFairCertification } from '@features/Fair/hooks/useFairCertification';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import { useStartingOrSupportingBillingPlanData } from '@features/Orcid/hooks/useStartingOrSupportingBillingPlanData';
import { useFairCertificationStore } from '@features/Fair/store/fairCertificationStore';
import { useDataProviderStore } from '@/store/dataProviderStore';

const FAIR_REGISTER_INTEREST_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScVAzXyEoPNBno9qorv2pQU9QmUalagtcoRn9Tze4V5TQZ1Pw/viewform?usp=dialog';

const SUCCESS_MESSAGE_DURATION_MS = 5000;

const loadFairCertification = async (ref?: string): Promise<FairCertificationData> => {
  return (await retrieveContent('fair-certification', {
    ref,
    transform: 'object',
  })) as FairCertificationData;
};

export function FAIRCertificationPage() {
  useDocumentTitle('FAIR Certification');
  const { fairCertification } = useFairCertification();
  const { selectedDataProvider } = useDataProviderStore();
  const { organisation } = useOrganisation();
  const { isStartingOrSupportingPlan } = useStartingOrSupportingBillingPlanData([], organisation);
  const grantApprovedAccess = useFairCertificationStore((state) => state.grantApprovedAccess);
  const hasRegisteredInterest = useFairCertificationStore((state) =>
    selectedDataProvider?.id ? state.hasRegisteredInterest(selectedDataProvider.id) : false,
  );
  const [stateData, setStateData] = useState<FairCertificationData | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const hasLoadedRef = useRef(false);

  const dataProviderId = selectedDataProvider?.id;

  const hasApprovedAccess =
    hasRegisteredInterest ||
    (fairCertification?.status != null && fairCertification.status !== 'not_certified');

  const handleRegisterInterest = useCallback(() => {
    if (dataProviderId) {
      grantApprovedAccess(dataProviderId);
    }

    setShowSuccessMessage(true);
  }, [dataProviderId, grantApprovedAccess]);

  useEffect(() => {
    if (!showSuccessMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, SUCCESS_MESSAGE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;

    loadFairCertification().then((content) => {
      setStateData(content);
    });
  }, []);

  if (!stateData) {
    return null;
  }

  if (hasApprovedAccess && !showSuccessMessage) {
    return <ApprovedFairView certificationQuestions={fairCertification?.questions} />;
  }

  console.log(isStartingOrSupportingPlan, "isStartingOrSupportingPlan")

  return (
    <FairFeature
      data={stateData}
      showSuccessMessage={showSuccessMessage}
      registerInterestHref={isStartingOrSupportingPlan ? FAIR_REGISTER_INTEREST_FORM_URL : undefined}
      onRegisterInterest={isStartingOrSupportingPlan ? undefined : handleRegisterInterest}
    />
  );
}
