import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useState, useEffect, useRef } from 'react';
import { useDataProviderStore } from '@/store/dataProviderStore';
import retrieveContent from '@/utils/retrieveContent';
import { setAssetsUrl } from '@/utils/contentUtils';
import { DocumentationFeature } from '@features/Documentation/Documentation.tsx';

interface DocumentationContent {
  [key: string]: {
    items?: Record<
      string,
      {
        images?: Record<string, { file: string }>;
        descriptionDashboard?: string;
      }
    >;
    header?: {
      title: string;
      caption: string;
    };
  };
}

const getSections = async (
  path: string,
  dataProviderId?: number,
  ref?: string
): Promise<DocumentationContent> => {
  const content = (await retrieveContent(path, {
    ref,
    transform: 'object',
  })) as DocumentationContent;

  delete (content as { headerAbout?: unknown }).headerAbout;

  Object.values(content).forEach((section) => {
    if (section.items) {
      setAssetsUrl(section.items, dataProviderId);
    }
  });

  return content;
};

export const DocumentationPage = () => {
  useDocumentTitle('Documentation');
  const { selectedDataProvider } = useDataProviderStore();
  const [stateData, setStateData] = useState<DocumentationContent>({});
  const [dataProviderDocs, setDataProviderDocs] = useState<DocumentationContent | null>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;

    Promise.all([
      getSections('docs-membership', selectedDataProvider?.id),
      getSections('docs-dataProvider', selectedDataProvider?.id),
    ]).then(([membershipContent, dataProviderContent]) => {
      setStateData(membershipContent);
      setDataProviderDocs(dataProviderContent);
    });
  }, [selectedDataProvider?.id]);

  if (Object.getOwnPropertyNames(stateData).length === 0) {
    return null;
  }

  const headerDashboard = stateData.headerDashboard || stateData.header;
  const providersHeader = dataProviderDocs?.providersHeader || dataProviderDocs?.header;

  if (!headerDashboard?.header) {
    return null;
  }

  return (
    <DocumentationFeature
      headerDashboard={headerDashboard as { header: { title: string; caption: string } }}
      dataProviderDocs={{
        providersHeader: providersHeader as { header: { title: string; caption: string } },
        ...dataProviderDocs,
      }}
      membershipPlan={(selectedDataProvider as { membershipPlan?: string })?.membershipPlan || null}
      {...stateData}
    />
  );
};

