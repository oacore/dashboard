import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Cell, Bar, BarChart, ReferenceLine, XAxis, Tooltip } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'
import { scaleSqrt } from 'd3-scale'

import CustomTooltip from './tooltip'
import styles from './styles.module.css'

const TimeLagChart = React.memo(
  ({
    data,
    className,
    from = Number.NEGATIVE_INFINITY,
    size = Number.POSITIVE_INFINITY,
    height = 300,
    barWidth = 4,
    gutterWidth = 2,
    ...restProps
  }) => {
    const [normalizedData, setNormalizedData] = useState([])

    const chartRef = useRef(null)
    useEffect(() => {
      const rawIntervalSize =
        data[data.length - 1].depositTimeLag - data[0].depositTimeLag
      const dataMap = new Map(data.map((e) => [e.depositTimeLag, e.worksCount]))
      const normalize = []

      const maxNumber = data.reduce(
        (acc, curr) => Math.max(curr.worksCount, acc),
        1
      )
      const scale = scaleSqrt().domain([0, maxNumber])

      for (let i = 0; i <= rawIntervalSize; i++) {
        const lagIndex = i + data[0].depositTimeLag
        if (lagIndex >= from && normalize.length < size) {
          normalize.push({
            depositTimeLag: lagIndex,
            worksCount: dataMap.get(lagIndex) || 0,
            worksCountScaled: scale(dataMap.get(lagIndex) || 0),
          })
        }
      }

      setNormalizedData(normalize)
    }, [data])

    const callback = useCallback((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((el) => {
            if (
              el.classList.contains('start') ||
              // sometimes mutation observer detect only change in parent,
              // i.e. g element not path element
              el.firstElementChild?.classList.contains('start')
            ) {
              el.scrollIntoView({
                // alight horizontally
                inline: 'start',
              })
              observer.disconnect()
            }
          })
        }
      })
    }, [])

    useEffect(() => {
      const observer = new MutationObserver(callback)
      const config = {
        childList: true,
        subtree: true,
      }
      observer.observe(chartRef.current, config)
      chartRef.current.style.setProperty('--chart-height', `${height}px`)

      return () => {
        observer.disconnect()
      }
    }, [])

    // if bar is empty recharts doesn't render cell
    const barWithValue = useMemo(
      () =>
        normalizedData?.find((d) => d.depositTimeLag >= -20 && d.worksCount),
      [normalizedData]
    )

    return (
      <div
        ref={chartRef}
        className={classNames.use(styles.chartWrapper, className)}
        {...restProps}
      >
        {normalizedData.length !== 0 && (
          <BarChart
            // let's assume approx. 6 (4 bar width + 2 bar gap) pixels
            // per bar by default
            width={normalizedData.length * (barWidth + gutterWidth)}
            height={height}
            data={normalizedData}
            barCategoryGap={gutterWidth}
            barSize={barWidth}
          >
            <XAxis
              dataKey="depositTimeLag"
              tickLine={false}
              ticks={normalizedData
                .map((d) => d.depositTimeLag)
                .filter((i) => i % 30 === 0)}
            />
            <Tooltip content={<CustomTooltip data={normalizedData} />} />
            <ReferenceLine y={0} className={styles.referenceLine} />
            <Bar dataKey="worksCountScaled">
              {normalizedData.map(({ depositTimeLag }) => (
                <Cell
                  id={depositTimeLag}
                  className={classNames
                    .use({
                      'lag-bar': true,
                      'compliant': depositTimeLag < 90,
                      'start': depositTimeLag === barWithValue.depositTimeLag,
                    })
                    .from(styles)
                    .toString()}
                  key={depositTimeLag}
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </div>
    )
  }
)

export default TimeLagChart
