import { Switch } from 'antd';

import { TextData } from '@features/Sdg/texts';
import HorizontalChart from './horizontalSdgChart'
import ReChartBarChart from './reChartBarChart'
import "../styles.css"
import {CrToggleTabs} from '@oacore/core-ui';

interface SdgType {
  id: string;
  title: string;
  icon: string;
  iconH?: string;
  color: string;
  outputCount: number;
}

interface SdgTypeBase {
  id: string;
  title: string;
  icon: string;
  iconH?: string;
  color: string;
  outputCount?: number;
}

interface ChartTogglerProps {
  handleToggle: (checked: boolean) => void;
  toggle: boolean;
  sdgTypes: SdgTypeBase[];
  updatedSdgTypes: SdgType[];
  data: Array<Record<string, string | number>>;
  sdgYearDataLoading: boolean;
  visibleColumns: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checkBillingType?: boolean;
  error?: Error | null;
}

const ChartToggler = ({
  handleToggle,
  toggle,
  sdgTypes,
  updatedSdgTypes,
  data,
  sdgYearDataLoading,
  visibleColumns,
  activeTab,
  setActiveTab,
  checkBillingType,
  error,
}: ChartTogglerProps) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="horizontal-view-chart-wrapper">
      <div className="header-wrapper">
        {activeTab !== 'yearly' ? (
          <h1>SDG articles by goals</h1>
        ) : (
          <h1>{TextData.chart.table.title}</h1>
        )}
        <div className="action-wrapper">
          <div className="toggle-wrapper">
            <Switch
              id="sdg-toggle"
              checked={toggle}
              onChange={handleToggle}
              className="toggle-wwitch"
            />
            Show as %
          </div>
          <CrToggleTabs
            activeKey={activeTab}
            onChange={handleTabClick}
            items={[
              {
                key: 'yearly',
                label: TextData.tab.yearly,
              },
              {
                key: 'overall',
                label: TextData.tab.overall,
              },
            ]}
          />
        </div>
      </div>
      {error ? (
        <div className="chart-toggler-error-wrapper" role="alert" aria-live="polite">
          <p className="no-data-message chart-toggler-error-message">
            Failed to load SDG chart data. Please try again later.
          </p>
        </div>
      ) : activeTab === 'yearly' ? (
        <ReChartBarChart
          sdgTypes={sdgTypes}
          data={data}
          updatedSdgTypes={updatedSdgTypes}
          sdgYearDataLoading={sdgYearDataLoading}
          visibleColumns={visibleColumns}
          toggle={toggle}
        />
      ) : (
        <HorizontalChart
          updatedSdgTypes={updatedSdgTypes}
          sdgTypes={sdgTypes}
          data={updatedSdgTypes}
          toggle={toggle}
          checkBillingType={checkBillingType}
        />
      )}
    </div>
  );
};

export default ChartToggler;
