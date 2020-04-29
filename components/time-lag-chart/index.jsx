/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Cell, Bar, BarChart, ReferenceLine, XAxis, Tooltip } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'
import { scaleSqrt } from 'd3-scale'

import depositTimeLag from './data'
import CustomTooltip from './tooltip'
import styles from './styles.module.css'

const COMPLIANCE_LIMIT = 90

// converts source DepositTimeLag object to simple [x, y] point
const toPoints = ({ depositTimeLag, worksCount }) => [
  depositTimeLag,
  worksCount,
]

// converts [x, y] point to actual value
const toX = ([x]) => x
const toY = ([, y]) => y

// creates square root scale applicator based on maximal value parameter
const toSqrtScale = (yMax) => {
  const scale = scaleSqrt().domain([0, yMax])
  return ([x, y]) => [x, scale(y || 0)]
}

/**
 * For a sorted array of [x, y] pints returns new array,
 * where are missing x-values filled with y-values = 0
 */
const withGaps = (values = [], [x, y]) => {
  const [prevX] = values[values.length - 1] ?? [x - 1]
  values.push(...Array.from(Array(x - prevX - 1), (_, i) => [prevX + i + 1, 0]))
  values.push([x, y])
  return values
}

const TimeLagChart = React.forwardRef(
  (
    {
      className,
      data,
      barWidth = 4,
      gutterWidth = 2,
      height = 300,
      ...restProps
    },
    ref
  ) => {
    const chartRef = useRef(ref)
    return (
      <div
        ref={chartRef}
        className={classNames.use(styles.chartWrapper, className)}
        {...restProps}
      >
        {data.length !== 0 && (
          <BarChart
            // let's assume approx. 6 (4 bar width + 2 bar gap) pixels
            // per bar by default
            width={data.length * (barWidth + gutterWidth)}
            height={height}
            data={data}
            barCategoryGap={gutterWidth}
            barSize={barWidth}
          >
            <XAxis
              dataKey="0"
              tickLine={false}
              ticks={data.map(toX).filter((x) => x % 30 === 0)}
            />
            <Tooltip content={<CustomTooltip data={data} />} />
            <ReferenceLine y={0} className={styles.referenceLine} />
            <Bar dataKey="1">
              {data.map(([x]) => (
                <Cell
                  id={x}
                  className={classNames
                    .use({
                      'lag-bar': true,
                      'compliant': x < COMPLIANCE_LIMIT,
                      'start': x === 0,
                    })
                    .from(styles)
                    .toString()}
                  key={x}
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </div>
    )
  }
)

const TimeLagChartController = React.memo(
  ({
    data,
    from = Number.NEGATIVE_INFINITY,
    size = Number.POSITIVE_INFINITY,
    ...restProps
  }) => {
    const points = depositTimeLag.map(toPoints)
    const scaledPoints = points
      .map(toSqrtScale(Math.max(...points.map(toY))))
      .reduce(withGaps)
    console.log(scaledPoints)

    //     const chartRef = useRef(null)
    //     useEffect(() => {
    //       const rawIntervalSize =
    //         data[data.length - 1].depositTimeLag - data[0].depositTimeLag
    //       const dataMap = new Map(data.map((e) => [e.depositTimeLag, e.worksCount]))
    //       const normalize = []
    //
    //       const maxNumber = data.reduce(
    //         (acc, curr) => Math.max(curr.worksCount, acc),
    //         1
    //       )
    //       const scale = scaleSqrt().domain([0, maxNumber])
    //
    //       for (let i = 0; i <= rawIntervalSize; i++) {
    //         const lagIndex = i + data[0].depositTimeLag
    //         if (lagIndex >= from && normalize.length < size) {
    //           normalize.push({
    //             depositTimeLag: lagIndex,
    //             worksCount: dataMap.get(lagIndex) || 0,
    //             worksCountScaled: scale(dataMap.get(lagIndex) || 0),
    //           })
    //         }
    //       }
    //
    //       setNormalizedData(normalize)
    //     }, [data])

    //     const callback = useCallback((mutationsList, observer) => {
    //       mutationsList.forEach((mutation) => {
    //         if (mutation.type === 'childList') {
    //           mutation.addedNodes.forEach((el) => {
    //             if (
    //               el.classList.contains('start') ||
    //               // sometimes mutation observer detect only change in parent,
    //               // i.e. g element not path element
    //               el.firstElementChild?.classList.contains('start')
    //             ) {
    //               el.scrollIntoView({
    //                 // alight horizontally
    //                 inline: 'start',
    //               })
    //               observer.disconnect()
    //             }
    //           })
    //         }
    //       })
    //     }, [])
    //
    //     useEffect(() => {
    //       const observer = new MutationObserver(callback)
    //       const config = {
    //         childList: true,
    //         subtree: true,
    //       }
    //       observer.observe(chartRef.current, config)
    //       chartRef.current.style.setProperty('--chart-height', `${height}px`)
    //
    //       return () => {
    //         observer.disconnect()
    //       }
    //     }, [])

    // if bar is empty recharts doesn't render cell
    // const barWithValue = useMemo(
    //   () =>
    //     normalizedData?.find((d) => d.depositTimeLag >= -20 && d.worksCount),
    //   [normalizedData]
    // )

    return <TimeLagChart data={scaledPoints} {...restProps} />
  }
)

export default TimeLagChartController
