import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import BarChart from './bar-chart'
import styles from './styles.css'

const sum = (data) => data.reduce((total, [, count]) => total + count, 0)

const TimeLagChartDescription = ({ data }) => {
  const totalCount = sum(data)
  const compliantCount = sum(data.filter(([lag]) => lag <= 90))
  const nonCompliantCount = totalCount - compliantCount

  return (
    <>
      <p>
        The chart displays outputs aggregated by deposit time lag that is the
        difference between publication data and deposit date.
      </p>
      <p>
        {totalCount} out of these outputs {compliantCount} are compliant and{' '}
        {nonCompliantCount} are not compliant.
      </p>
    </>
  )
}

const fillGaps = (dataEntries) =>
  dataEntries.reduce((values, [x, y]) => {
    const [prevX] = values[values.length - 1] ?? [x - 1]
    values.push(
      ...Array.from(Array(x - prevX - 1), (_, i) => [prevX + i + 1, 0])
    )
    values.push([x, y])
    return values
  }, [])

const TimeLagChart = ({ data, children, className, ...chartProps }) => (
  <BarChart
    className={classNames.use(styles.timeLag, className)}
    data={fillGaps(data)}
    {...chartProps}
  >
    {children == null ? <TimeLagChartDescription data={data} /> : children}
  </BarChart>
)

export default TimeLagChart
