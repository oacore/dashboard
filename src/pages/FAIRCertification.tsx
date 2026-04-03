import { useDocumentTitle } from '@hooks/useDocumentTitle.ts';
import { useState, useEffect, useRef } from 'react';
import retrieveContent from '@/utils/retrieveContent';
import { FairFeature, type FairCertificationData } from '@features/Fair/Fair.tsx';
// import {ApprovedFairView} from '@features/Fair/components/ApprovedFairView.tsx';

const loadFairCertification = async (ref?: string): Promise<FairCertificationData> => {
  return (await retrieveContent('fair-certification', {
    ref,
    transform: 'object',
  })) as FairCertificationData;
};

export function FAIRCertificationPage() {
  useDocumentTitle('FAIR Certification');
  const [stateData, setStateData] = useState<FairCertificationData | null>(null);
  const hasLoadedRef = useRef(false);

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
  // TODO RENDER VIEW BASED ON STATUS

  return (
    // true ? <ApprovedFairView/> : <FairFeature data={stateData} />
    <FairFeature data={stateData} />
  );
}
