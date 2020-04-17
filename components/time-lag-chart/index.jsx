import React, { useState, useEffect } from 'react'
import {
  Cell,
  Bar,
  BarChart,
  ReferenceLine,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import CustomTooltip from './tooltip'
import styles from './index.module.css'

const TimeLagChart = React.memo(
  ({ data, width = '100%', height = 300, ...restProps }) => {
    const [normalizedData, setNormalizedData] = useState([])

    useEffect(() => {
      const rawIntervalSize =
        data[data.length - 1].depositTimeLag - data[0].depositTimeLag
      const dataMap = new Map(data.map((e) => [e.depositTimeLag, e.worksCount]))
      const normalize = []

      for (let i = 0; i < rawIntervalSize; i++) {
        const lagIndex = i + data[0].depositTimeLag
        if (dataMap.has(lagIndex)) {
          normalize.push({
            depositTimeLag: lagIndex,
            worksCount: dataMap.get(lagIndex),
          })
        } else {
          normalize.push({
            depositTimeLag: lagIndex,
            worksCount: 0,
          })
        }
      }

      setNormalizedData(normalize)
    }, [data])

    if (normalizedData.length === 0) return null

    return (
      <ResponsiveContainer width={width} height={height} {...restProps}>
        <BarChart margin={{ bottom: -5 }} data={normalizedData}>
          <XAxis
            dataKey="depositTimeLag"
            tickLine={false}
            // TODO: create function for generating these values
            ticks={[0, 30, 92]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} className={styles.referenceLine} />
          <Bar dataKey="worksCount">
            {normalizedData.map(({ depositTimeLag }) => (
              <Cell
                className={classNames
                  .use({
                    'lag-bar': true,
                    'compliant': parseInt(depositTimeLag, 10) < 90,
                  })
                  .from(styles)
                  .toString()}
                key={depositTimeLag}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }
)

export default TimeLagChart
