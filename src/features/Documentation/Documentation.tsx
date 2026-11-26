import React, { useMemo, useState } from 'react';
import './styles.css';
import {
  CrPaper,
  DocumentationGuidePage,
  Markdown,
  normalizeDocumentationItems,
  toNavItems,
  type DocsTutorial,
} from '@oacore/core-ui';

// Types
export interface DocumentationHeader {
  header: {
    title: string;
    caption: string;
  };
}

export interface DocumentationItems {
  items?: unknown;
  tutorial?: DocsTutorial;
}

export interface DocumentationNavigation {
  navItems: unknown;
}

export interface DocumentationFeatureProps {
  headerDashboard: DocumentationHeader;
  dataProviderDocs: {
    providersHeader?: DocumentationHeader;
    dataProviderDocs?: DocumentationItems;
    navigation?: DocumentationNavigation;
    [key: string]: unknown;
  };
  documentationSwitcher?: Array<{ title: string }>;
  docs?: DocumentationItems;
  navigation?: DocumentationNavigation;
  /** Optional image URLs for the tutorial buttons (membership docs / data provider's guide). */
  videoIcon?: string;
  videoGuide?: string;
  [key: string]: unknown;
}

const DEFAULT_SWITCHER_OPTIONS = [
  { title: 'CORE Data Provider’s Guide' },
  { title: 'Membership Documentation' },
];

/** Fixed dashboard header (see .dashboard-header): the switcher and outline stick below it. */
const DASHBOARD_HEADER_HEIGHT = 56;

export const DocumentationFeature: React.FC<DocumentationFeatureProps> = ({
  headerDashboard,
  dataProviderDocs,
  documentationSwitcher = DEFAULT_SWITCHER_OPTIONS,
  docs,
  navigation,
  videoIcon,
  videoGuide,
}) => {
  const providersTitle = documentationSwitcher[0]?.title ?? DEFAULT_SWITCHER_OPTIONS[0].title;
  const membershipTitle = documentationSwitcher[1]?.title ?? DEFAULT_SWITCHER_OPTIONS[1].title;
  const options = useMemo(
    () => documentationSwitcher.map((item) => item.title),
    [documentationSwitcher]
  );
  const [selectedOption, setSelectedOption] = useState<string>(membershipTitle);

  const isMembership = selectedOption !== providersTitle;
  const source = isMembership ? docs : dataProviderDocs.dataProviderDocs;
  const sourceNavigation = isMembership ? navigation : dataProviderDocs.navigation;
  const currentHeader = isMembership ? headerDashboard : dataProviderDocs.providersHeader;
  const tutorialImage = isMembership ? videoIcon : videoGuide;

  const items = useMemo(() => normalizeDocumentationItems(source?.items), [source?.items]);
  const navItems = useMemo(() => toNavItems(sourceNavigation), [sourceNavigation]);

  if (!currentHeader?.header) {
    return null;
  }

  return (
    <CrPaper className="documentation-paper">
      <DocumentationGuidePage
        key={selectedOption}
        docs={items}
        navigation={navItems}
        tutorial={source?.tutorial}
        docsTitle={selectedOption}
        imageSource={!isMembership}
        switcher={{ options, onChange: setSelectedOption }}
        intro={
          <div className="documentation-header-wrapper">
            <h1 className="documentation-header">{currentHeader.header.title}</h1>
            <Markdown className="markdown-text">{currentHeader.header.caption}</Markdown>
          </div>
        }
        withLayout={false}
        switcherVariant="dashboard"
        stickyTop={DASHBOARD_HEADER_HEIGHT}
        gutter={0}
        descriptionField="descriptionDashboard"
        tutorialIcon={
          tutorialImage ? (
            <img src={tutorialImage} alt="" width={24} height={24} aria-hidden />
          ) : undefined
        }
      />
    </CrPaper>
  );
};
