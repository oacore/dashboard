import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '@oacore/design'

import texts from '../../../texts/sdg/sdg.yml'
import OverviewCard from './overview-card'
import { GlobalContext } from '../../../store'
import { sdgTypes } from '../../../utils/hooks/use-sdg-icon-renderer'
import { formatNumber } from '../../../utils/helpers'
import styles from '../styles.module.css'

const SdgCard = observer(() => {
  const { dataProvider } = useContext(GlobalContext)

  // Process SDG data
  const treemapData = sdgTypes
    .filter((sdg) => sdg.id !== 'all')
    .map((sdg) => {
      const sdgDataItem = Object.values(
        dataProvider?.sdgYearData?.data || {}
      ).find((data) => data.type === sdg.id)
      const outputCount = sdgDataItem?.yearlyData
        ? Object.values(sdgDataItem.yearlyData).reduce(
            (sum, value) => sum + value,
            0
          )
        : 0

      return outputCount > 0
        ? {
            name: sdg.id,
            size: outputCount,
            color: sdg.color,
          }
        : null
    })
    .filter(Boolean)
    .sort((a, b) => b.size - a.size)

  const CustomContent = ({ x, y, width, height, name, color }) => {
    const fontSize = Math.min(width / 6, height / 3, 16)
    const displayText = width < 30 ? name.replace('SDG', '') : name

    return (
      <g transform={`translate(${x},${y})`}>
        <rect
          width={width}
          height={height}
          fill={color || '#f5f5f5'}
          stroke="#fff"
          strokeWidth={2}
        />
        {width > 10 && height > 8 && (
          <text
            x={width / 2}
            y={height / 2}
            className={styles.treemapText}
            fontSize={fontSize}
          >
            {displayText}
          </text>
        )}
      </g>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null

    const { name, size, color } = payload[0].payload
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipTitle} style={{ color }}>
          {name}
        </p>
        <p className={styles.tooltipCount}>{formatNumber(size)} outputs</p>
      </div>
    )
  }

  return (
    <OverviewCard title={texts.card.title} tooltip={texts.card.tooltip}>
      {treemapData.length > 0 ? (
        <div className={styles.treemapContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className={styles.noDataMessage}>No SDG data available</p>
      )}
      <Button className={styles.cardButton} variant="outlined">
        {texts.card.action.title}
      </Button>
    </OverviewCard>
  )
})

export default SdgCard
