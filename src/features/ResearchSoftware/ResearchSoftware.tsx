import { useMemo, useEffect, useState } from 'react';
import { CrTabs } from '@components/common/CrTabs/CrTabs.tsx';
import { CrFeatureLayout, CrCardsWrapper } from '@oacore/core-ui';

import { useDataProviderStore } from '@/store/dataProviderStore';
import { TextData } from '@features/ResearchSoftware/texts';
import useSwTableData from '@features/ResearchSoftware/hooks/useSwTableData';
import { useSwStore } from '@features/ResearchSoftware/store/swStore';
import { useDownloadSwCsv } from '@features/ResearchSoftware/hooks/useDownloadSwCsv';
import type { SwCounts, SwTab } from '@features/ResearchSoftware/types/sw.types';
import { SwHeaderArea } from '@features/ResearchSoftware/components/SwHeaderArea'

import { SwStats } from '@features/ResearchSoftware/components/swStats';
import '@features/ResearchSoftware/style.css';
import { SwTable } from '@features/ResearchSoftware/components/swTable.tsx';

const COUNT_KEY_BY_TAB: Record<SwTab, keyof SwCounts> = {
  ready: 'ready_for_validation',
  sent: 'sent',
  responded: 'responded',
  cancelled: 'cancelled',
} as const;

const UI_ACTIVE_TAB: SwTab = 'ready';

export const SwFeature = () => {
  const { selectedDataProvider } = useDataProviderStore();
  const { activeTab, setActiveTab, searchTerm, resetOnPageEnter } = useSwStore();
  const { downloadCsv, isLoading: isDownloadingCsv } = useDownloadSwCsv();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    resetOnPageEnter();
  }, [resetOnPageEnter]);

  useEffect(() => {
    if (activeTab !== UI_ACTIVE_TAB) {
      setActiveTab(UI_ACTIVE_TAB);
    }
  }, [activeTab, setActiveTab]);

  const notificationsEnabled = Boolean(
    selectedDataProvider &&
    'swNotificationsEnabled' in selectedDataProvider &&
    (selectedDataProvider as { swNotificationsEnabled?: boolean }).swNotificationsEnabled
  );

  const { rows, counts, error, isLoading, isLoadingMore, loadMore, hasMore } = useSwTableData({
    dataProviderId: selectedDataProvider?.id || null,
    tab: UI_ACTIVE_TAB,
    size: 50,
    searchTerm,
  });

  const tabsConfig: Array<{ key: SwTab; label: string }> = useMemo(() => {
    const actions = TextData.table.actions ?? [];
    return actions.map((action) => ({
      key: action.action as SwTab,
      label: action.name,
    }));
  }, []);

  const tabs = useMemo(
    () =>
      tabsConfig.map(({ key, label }, index) => {
        const isActive = key === UI_ACTIVE_TAB;
        const isDisabled = index !== 0; // Disable all tabs except the first one

        return {
          key,
          label,
          disabled: isDisabled,
          children: (
            <SwTable
              activeTab={key}
              rows={isActive ? rows : []}
              totalCount={counts?.[COUNT_KEY_BY_TAB[key]] ?? 0}
              loading={isActive ? isLoading : false}
              hasMore={isActive ? hasMore : false}
              loadMore={isActive ? loadMore : undefined}
              isLoadingMore={isActive ? isLoadingMore : false}
              downloadCsv={downloadCsv}
              downloadCsvLoading={isDownloadingCsv}
            />
          ),
        };
      }),
    [tabsConfig, rows, counts, isLoading, hasMore, loadMore, isLoadingMore, downloadCsv, isDownloadingCsv]
  );

  const handleTabChange = (tabKey: string) => {
    if (tabKey === UI_ACTIVE_TAB) {
      setActiveTab(UI_ACTIVE_TAB);
    }
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleReadyCardClick = () => {
    setActiveTab(UI_ACTIVE_TAB);
  };

  return (
    <CrFeatureLayout>
      <SwHeaderArea showSettings={showSettings} setShowSettings={setShowSettings} />
      <div className="picker-wrapper">
        <span className="date-title">{TextData.calendar.title}</span>
      </div>
      <CrCardsWrapper>
        <SwStats
          counts={counts}
          isLoading={isLoading}
          error={error}
          notificationsEnabled={notificationsEnabled}
          onGoToSettings={handleOpenSettings}
          onReadyClick={handleReadyCardClick}
          countKeyByTab={COUNT_KEY_BY_TAB}
        />
      </CrCardsWrapper>
      <CrTabs
        tabs={tabs}
        defaultActiveKey={UI_ACTIVE_TAB}
        activeKey={UI_ACTIVE_TAB}
        onChange={handleTabChange}
        type="card"
      />
    </CrFeatureLayout>
  );
};
