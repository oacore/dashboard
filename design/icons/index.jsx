import React from 'react'
import SVG from 'react-inlinesvg'
import classNames from 'classnames'

import iconCLassNames from './index.css'
import DataIcon from './assets/data.svg'
import OverviewIcon from './assets/overview.svg'
import PluginsIcon from './assets/plugins.svg'
import SettingsIcon from './assets/settings.svg'
import StatisticsIcon from './assets/statistics.svg'

const mapNameToModule = name => {
  const iconMap = {
    data: DataIcon,
    overview: OverviewIcon,
    plugins: PluginsIcon,
    settings: SettingsIcon,
    statistics: StatisticsIcon,
  }

  if (!(name in iconMap)) throw new Error(`Icon ${name} not found`)
  return iconMap[name]
}

const Icon = React.memo(({ className, iconType, isActive = false }) => (
  // `key` property has to be specified otherwise component
  // won't rerender when isActive changes
  // `react-inlinesvg` rerenders SVG component only
  // when value of `src` is changed
  <SVG
    key={`${iconType}.dashboard-icon.${isActive ? 'active' : ''}`}
    src={mapNameToModule(iconType)}
    className={classNames(
      iconCLassNames.dashboardIcon,
      {
        [iconType.active]: isActive,
      },
      className
    )}
  />
))

export default Icon
