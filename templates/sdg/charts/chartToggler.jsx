import { Switch } from '@oacore/design'
import React from 'react'

import styles from '../styles.module.css'
import texts from '../../../texts/sdg/sdg.yml'
import HorizontalChart from './horizontalSdgChart'
import ReChartBarChart from './reChartBarChart'

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
}) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className={styles.horizontalViewChartWrapper}>
      <div className={styles.headerWrapper}>
        {activeTab !== 'yearly' ? (
          <h1>SDG articles by goals</h1>
        ) : (
          <h1>{texts.chart.table.title}</h1>
        )}
        <div className={styles.actionWrapper}>
          <div className={styles.toggleWrapper}>
            <Switch
              id="sdg-toggle"
              checked={toggle}
              onChange={handleToggle}
              label={texts.chart.toggle.title}
              className={styles.toggleSwitch}
            />
          </div>
          <div className={styles.toggleTabs}>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div
              className={`${styles.tab} ${
                activeTab === 'yearly' ? styles.tabActive : styles.tabInactive
              }`}
              onClick={() => handleTabClick('yearly')}
            >
              {texts.tab.yearly}
            </div>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <div
              className={`${styles.tab} ${
                activeTab === 'overall' ? styles.tabActive : styles.tabInactive
              }`}
              onClick={() => handleTabClick('overall')}
            >
              {texts.tab.overall}
            </div>
          </div>
        </div>
      </div>
      {activeTab === 'yearly' ? (
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
  )
}

export default ChartToggler
