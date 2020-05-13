import React, { useEffect, useRef, useCallback } from 'react'
import { Cell, Bar, BarChart, ReferenceLine, XAxis, Tooltip } from 'recharts'
import { classNames } from '@oacore/design/lib/utils'
import { scaleSqrt } from 'd3-scale'

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
// changes second point to scaled and stores original value as third
const toSqrtScale = (yMax) => {
  const scale = scaleSqrt().domain([0, yMax])
  return ([x, y, ...rest]) => [x, scale(y || 0), ...rest]
}

/**
 * For a sorted array of [x, y] pints returns new array,
 * where are missing x-values filled with y-values = 0
 */
const withGaps = (values, [x, y, ...rest]) => {
  const [prevX] = values[values.length - 1] ?? [x - 1]
  values.push(...Array.from(Array(x - prevX - 1), (_, i) => [prevX + i + 1, 0]))
  values.push([x, y, ...rest])
  return values
}

const withBuckets = (size, start = 0) => (buckets, value, index) => {
  if ((index + start) % size === 0 || index === 0) {
    const current = [value]
    buckets.push(current)
  } else {
    const last = buckets[buckets.length - 1]
    last.push(value)
  }

  return buckets
}

const toSum = (values) => values.reduce((total, x) => total + x, 0)

const test = [1, 2, 3, 4, 5, 6, 7]

// eslint-disable-next-line
console.log(test.reduce(withBuckets(2), []).map(toSum))

const useBoundaryScrollHandler = (options = {}) => {
  const {
    initialShift, // index of the column 0, initial shift
    barCount = COMPLIANCE_LIMIT,
    barWidth = 4,
    gutterWidth = 2,
  } = options

  const deps = [initialShift, barCount, barWidth, gutterWidth]
  const callback = useCallback((element) => {
    const { clientWidth } = element
    const barVisibleCount = Math.floor(
      (clientWidth + gutterWidth) / (barWidth + gutterWidth)
    )

    const startBarIndex =
      barVisibleCount > barCount
        ? initialShift - Math.floor((barVisibleCount - barCount) / 2)
        : initialShift
    const scrollPosition =
      barWidth * (startBarIndex - 1) + gutterWidth * (startBarIndex - 1)

    element.scroll(scrollPosition, 0)
  }, deps)

  return callback
}

const useBoundaryHandler = (elementRef, options) => {
  const observerRef = useRef(null)

  const handle = useBoundaryScrollHandler(options)

  const dispose = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = null
  }, [observerRef])

  useEffect(() => {
    dispose()

    const element = elementRef.current
    const observer = new ResizeObserver(([{ target }]) => handle(target))
    observer.observe(element)
    observerRef.current = observer

    return dispose
  }, [elementRef, handle])

  return dispose
}

const useBoundary = (ref, options) => {
  const disposeBoundary = useBoundaryHandler(ref, options)

  // Do not sync scroll with 0 bar if user already scrolled
  const enableControl = useRef(true)
  const scrollDisposer = useCallback((event) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return

    enableControl.current = false
    disposeBoundary()
  }, [])

  return scrollDisposer
}

const TimeLagChart = React.forwardRef(
  (
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
          <BarChart
            // calculating width based on bar size and the space between bars
            width={scaledPoints.length * (barWidth + gutterWidth)}
            height={height}
            data={scaledPoints}
            barCategoryGap={gutterWidth}
            barSize={barWidth}
          >
            <XAxis
              dataKey="0"
              tickLine={false}
              ticks={scaledPoints.map(toX).filter((x) => x % 30 === 0)}
            />
            <Tooltip content={tooltip} />
            <ReferenceLine y={0} className={styles.referenceLine} />
            <Bar dataKey="1">
              {scaledPoints.map(([x]) => (
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
    minX = Number.NEGATIVE_INFINITY,
    maxX = Number.POSITIVE_INFINITY,
    ...restProps
  }) => {
    const points = data
      .map(toPoints)
      .filter(([x]) => x >= minX && x <= maxX)
      .reduce(withGaps, [])

    return <TimeLagChart data={points} {...restProps} />
  }
)

export default TimeLagChartController
