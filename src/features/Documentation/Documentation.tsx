import React, { useState, useEffect, useCallback } from 'react';
import {  Modal } from 'antd';
import { useLocation, useSearchParams } from 'react-router-dom';
import Markdown from '@components/common/Markdown/Markdown.tsx';
import { DocumentationMembership } from '@components/common/CrDocumentation/DocumentationMembership.tsx';
import { DocumentationMembershipNav, type TextData } from '@components/common/CrDocumentationNav/DocumentationMembershipNav.tsx';
import type { DocumentationItem, Tutorial } from '@components/common/CrDocumentation/DocumentationMembership.tsx';
import './styles.css';
import { CrPaper } from '@core/core-ui';
import {CrDocumentToggler} from '@components/common/CrDocumentToggler/CrDocumentToggler.tsx';


// Types
export interface DocumentationHeader {
  header: {
    title: string;
    caption: string;
  };
}

export interface DocumentationItems {
  items?: DocumentationItem[];
  tutorial?: Tutorial;
}

export interface DocumentationNavigation {
  navItems: {
    [key: string]: {
      item: string;
      href: string;
      hidden?: boolean;
    };
  };
}

export interface DocumentationData {
  items?: DocumentationItem[];
  tutorial?: Tutorial;
  navigation?: DocumentationNavigation;
  dataProviderDocs?: DocumentationItems;
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
  videoIcon?: string;
  videoGuide?: string;
  [key: string]: unknown;
}

const DEFAULT_SWITCHER_OPTIONS = [
  { title: 'CORE Data Provider’s Guide' },
  { title: 'Membership Documentation' },
];

const normalizeHref = (href: string): string => {
  return href.replace('#', '');
};

export const DocumentationFeature: React.FC<DocumentationFeatureProps> = ({
  headerDashboard,
  dataProviderDocs,
  documentationSwitcher = DEFAULT_SWITCHER_OPTIONS,
  docs,
  navigation,
  videoIcon,
  videoGuide,
}) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [highlight, setHighlight] = useState<number | undefined>(undefined);
  const [navActiveIndex, setNavActiveIndex] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(
    documentationSwitcher[1]?.title || DEFAULT_SWITCHER_OPTIONS[1].title
  );
  const [showNavigator, setShowNavigator] = useState<boolean>(false);
  const [visibleVideo, setVisibleVideo] = useState<{ src: string; title: string } | null>(null);

  const headerHeight = 56;

  const handleContentOpen = useCallback((condition: { src: string; title: string } | Tutorial): void => {
    if (condition) {
      // Handle Tutorial type
      if ('text' in condition) {
        setVisibleVideo({
          src: condition.src,
          title: condition.title || condition.text || 'Tutorial',
        });
      } else if ('src' in condition && 'title' in condition) {
        // Handle direct object with src and title
        setVisibleVideo({
          src: condition.src,
          title: condition.title,
        });
      }
    }
  }, []);

  const handleSelectChange = (value: string): void => {
    setSelectedOption(value);
    setNavActiveIndex(null);
    setHighlight(undefined);
  };

  const handleScrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  };

  const handleCloseVideo = (): void => {
    setVisibleVideo(null);
  };

  // Helper function to detect if URL is YouTube or Vimeo
  const isVideoPlatform = (url: string): boolean => {
    return /(youtube\.com|youtu\.be|vimeo\.com)/i.test(url);
  };

  // Helper function to convert YouTube URL to embed format
  const getEmbedUrl = (url: string): string => {
    if (/youtube\.com\/watch\?v=/.test(url)) {
      const videoId = url.match(/v=([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (/youtu\.be\//.test(url)) {
      const videoId = url.match(/youtu\.be\/([^?]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (/vimeo\.com\//.test(url)) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  // Handle hash navigation on mount and route change
  useEffect(() => {
    const { hash } = window.location;
    const id = hash.substring(1);

    if (id) {
      const element = document.getElementById(id);
      const currentDocs = selectedOption === documentationSwitcher[1]?.title
        ? docs?.items
        : dataProviderDocs.dataProviderDocs?.items;

      setTimeout(() => {
        if (element && currentDocs) {
          const rect = element.getBoundingClientRect();
          window.scrollTo({
            top: rect.top + window.scrollY - headerHeight,
            behavior: 'smooth',
          });

          const n = currentDocs.findIndex((item) => item.id === id);
          if (n !== -1) {
            setHighlight(n);
          }
        }
      }, 100);
    }
  }, [location.pathname, location.hash, selectedOption, docs?.items, dataProviderDocs.dataProviderDocs?.items, documentationSwitcher, headerHeight]);

  // Handle query parameter navigation
  useEffect(() => {
    const id = searchParams.get('r');
    const currentNavigation = selectedOption === documentationSwitcher[1]?.title
      ? navigation
      : dataProviderDocs.navigation;

    if (id && currentNavigation?.navItems) {
      const navItemsArray = Object.values(currentNavigation.navItems);
      const n = navItemsArray.findIndex(
        (item) => normalizeHref(item.href) === id
      );
      if (n !== -1) {
        setNavActiveIndex(n);
      }
    }
  }, [searchParams, selectedOption, navigation, dataProviderDocs.navigation, documentationSwitcher]);

  // Handle scroll to show/hide navigator
  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 0) {
        setShowNavigator(true);
      } else {
        setShowNavigator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isDataProviderSelected = selectedOption === documentationSwitcher[0]?.title;
  const currentHeader = isDataProviderSelected
    ? dataProviderDocs.providersHeader
    : headerDashboard;
  const optionsList = documentationSwitcher.map((item) => item.title);

  if (!currentHeader?.header) {
    return null;
  }

  const isDashboardDocs = selectedOption === documentationSwitcher[1]?.title;

  return (
    <CrPaper>
      <div className="documentation-header-wrapper">
        <h1 className="documentation-header">
          {currentHeader.header.title}
        </h1>
        <Markdown className="markdown-text">{currentHeader.header.caption}</Markdown>
      </div>
      <CrDocumentToggler
        selectedOption={selectedOption}
        handleSelectChange={handleSelectChange}
        handleKeyDown={handleKeyDown}
        optionsList={optionsList}/>
      <>
        {isDashboardDocs ? (
          <DocumentationMembership
            key="membership-docs"
            docs={docs?.items}
            handleContentOpen={handleContentOpen}
            highlight={highlight}
            docsTitle={documentationSwitcher[1]?.title}
            mulltyDocs
            tutorialIcon={videoIcon}
            showNavigator={showNavigator}
            handleScrollToTop={handleScrollToTop}
            nav={
              navigation ? (
                <DocumentationMembershipNav
                  key="membership-nav"
                  activeIndex={navActiveIndex}
                  setNavActiveIndex={setNavActiveIndex}
                  textData={navigation as TextData}
                  setHighlight={setHighlight}
                  mulltyDocs
                />
              ) : null
            }
          />
        ) : (
          <DocumentationMembership
            key="data-provider-docs"
            docs={dataProviderDocs.dataProviderDocs?.items}
            tutorial={dataProviderDocs.dataProviderDocs?.tutorial}
            highlight={highlight}
            imageSource
            docsTitle={documentationSwitcher[0]?.title}
            mulltyDocs
            tutorialIcon={videoGuide}
            showNavigator={showNavigator}
            handleScrollToTop={handleScrollToTop}
            handleContentOpen={handleContentOpen}
            nav={
              dataProviderDocs.navigation ? (
                <DocumentationMembershipNav
                  key="data-provider-nav"
                  activeIndex={navActiveIndex}
                  setNavActiveIndex={setNavActiveIndex}
                  textData={dataProviderDocs.navigation as TextData}
                  setHighlight={setHighlight}
                  mulltyDocs
                />
              ) : null
            }
          />
        )}

        {visibleVideo && (
          <Modal
            open={!!visibleVideo}
            onCancel={handleCloseVideo}
            footer={null}
            width={1100}
            centered
            className="video-modal"
            rootClassName="video-modal-root"
            closable={false}
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            <div className="video-wrapper">
              <button
                type="button"
                className="video-close-btn"
                aria-label="Close video"
                onClick={handleCloseVideo}
                tabIndex={0}
              >
                ×
              </button>
              <div className="video-container">
                <iframe
                  src={
                    isVideoPlatform(visibleVideo.src)
                      ? getEmbedUrl(visibleVideo.src)
                      : visibleVideo.src
                  }
                  title={visibleVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-iframe"
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                />
              </div>
            </div>
          </Modal>
        )}
      </>
    </CrPaper>
  );
};

