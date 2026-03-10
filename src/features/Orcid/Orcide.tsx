import { BasicOrcidTable } from './components/basicOrcid/BasicOrcidtable.tsx';
import { OtherOrcidTable } from './components/otherOrcide/OtherOrcidtable.tsx';
import { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css"
import { CrTabs } from '@components/common/CrTabs/CrTabs.tsx';
import { CrHeader, CrFeatureLayout, CrCardsWrapper } from '@core/core-ui';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { CrStatsCard } from '@components/common/CrStatsCard/CrStatsCard.tsx';
import { useOrcidStats } from '@features/Orcid/hooks/useOrcidData.ts';
import { TextData } from './texts/index.ts';
import { useDataProviderStore } from '@/store/dataProviderStore.ts';
import { useOrcidTableStore } from '@features/Orcid/store/orcidStore.ts';

export const OrcideFeature = () => {
  const [activeTab, setActiveTab] = useState('basic')
  const tableRef = useRef<HTMLDivElement>(null)
  const { selectedDataProvider } = useDataProviderStore();
  const { resetOnPageEnter } = useOrcidTableStore();

  useEffect(() => {
    resetOnPageEnter();
  }, [resetOnPageEnter]);

  const { stats, error, isLoading } = useOrcidStats(selectedDataProvider?.id || 0);

  const tabs = [
    {
      key: 'basic',
      label: TextData.table.actions[0].name,
      children: <BasicOrcidTable />
    },
    {
      key: 'other',
      label: TextData.table.actions[1].name,
      children: <OtherOrcidTable />
    }
  ];

  const scrollToTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleStatsCardClick = useCallback((tab: string) => {
    const tabKey = tab === 'other' ? 'other' : 'basic'
    setActiveTab(tabKey)

    requestAnimationFrame(() => {
      scrollToTable()
    })
  }, [scrollToTable])

  return (
    <CrFeatureLayout>
      <CrHeader
        title={TextData.title}
        showMore={
          <CrShowMore
            text={TextData.description}
            maxLetters={320}
          />
        }
      />
      <CrCardsWrapper>
        <CrStatsCard
          title={TextData.statsCards.withOrcid.title}
          description={TextData.statsCards.withOrcid.description}
          count={stats.basic}
          loading={isLoading}
          error={error}
          actionText={TextData.statsCards.withOrcid.action}
          infoText={TextData.statsCards.withOrcid.tooltip}
          onActionClick={() => handleStatsCardClick('basic')}
          wholeWidthCard
        />
        <CrStatsCard
          title={TextData.statsCards.otherOrcid.title}
          description={TextData.statsCards.otherOrcid.description}
          count={stats.fromOtherRepositories}
          loading={isLoading}
          error={error}
          actionText={TextData.statsCards.otherOrcid.action}
          infoText={TextData.statsCards.otherOrcid.tooltip}
          onActionClick={() => handleStatsCardClick('other')}
          showInfo
          wholeWidthCard
        />
      </CrCardsWrapper>
      <div ref={tableRef}>
        <CrTabs
          tabs={tabs}
          defaultActiveKey="basic"
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
        />
      </div>
    </CrFeatureLayout>
  );
};
