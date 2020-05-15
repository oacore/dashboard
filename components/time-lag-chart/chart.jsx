import React, { useRef } from 'react'
import {
  Cell,
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import { COMPLIANCE_LIMIT, toX, toY, toSqrtScale } from './data'
import CustomTooltip from './tooltip'
import useBoundary from './use-boundary'
import styles from './styles.module.css'

const TimeLagChart = (
  {
    className,
    data: points,
    barWidth = 4,
    gutterWidth = 2,
    height = 300,
    ...restProps
  },
  ref
) => {
  const chartRef = useRef(ref)
  const scaledPoints = points.map(toSqrtScale(Math.max(...points.map(toY))))
  const labels = scaledPoints.map(toX).filter((x) => (x[0] ?? x) % 30 === 0)

  const tooltip = <CustomTooltip data={points} />

  const disposeScrollControl = useBoundary(chartRef, {
    barWidth,
    gutterWidth,
    initialShift: points.findIndex(([x]) => x === 0),
  })

  return (
    <div
      ref={chartRef}
      className={classNames.use(styles.chartWrapper, className)}
      onWheel={disposeScrollControl}
      {...restProps}
    >
      {scaledPoints.length !== 0 && (
        <ResponsiveContainer
          // calculating width based on bar size and the space between bars
          minWidth={scaledPoints.length * (barWidth + gutterWidth)}
          height={height}
        >
          <BarChart
            data={scaledPoints}
            barCategoryGap={Math.floor(gutterWidth / 2)}
          >
            <XAxis dataKey="0" tickLine={false} ticks={labels} />
            <Tooltip content={tooltip} />
            <ReferenceLine y={0} className={styles.referenceLine} />
            <Bar dataKey="1">
              {scaledPoints.map(([xRange]) => {
                const x = xRange[0] ?? xRange
                return (
                  <Cell
                    id={x}
                    className={classNames
                      .use({
                        'lag-bar': true,
                        'compliant': x <= COMPLIANCE_LIMIT,
                        'start': x === 0,
                      })
                      .from(styles)
                      .toString()}
                    key={x}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default React.forwardRef(TimeLagChart)
