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
}) => (
  <div className={styles.horizontalViewChartWrapper}>
    <div className={styles.headerWrapper}>
      {toggle ? (
        <h1>SDG articles by goals</h1>
      ) : (
        <h1>{texts.chart.table.title}</h1>
      )}
      <div className={styles.toggleWrapper}>
        <Switch
          id="sdg-toggle"
          checked={toggle}
          onChange={handleToggle}
          label={texts.chart.toggle.title}
          className={styles.toggleSwitch}
        />
      </div>
    </div>
    {toggle ? (
      <HorizontalChart sdgTypes={sdgTypes} data={updatedSdgTypes} />
    ) : (
      <ReChartBarChart
        sdgTypes={sdgTypes}
        data={data}
        updatedSdgTypes={updatedSdgTypes}
        sdgYearDataLoading={sdgYearDataLoading}
        visibleColumns={visibleColumns}
      />
    )}
  </div>
)

export default ChartToggler
