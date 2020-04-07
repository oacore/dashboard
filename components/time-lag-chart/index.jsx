import React from 'react'

import { TimeLagChart } from '../../charts'

const TimeLagChartProcessor = ({ data, children, ...passProps }) => {
  const actualData = data
    .map(({ depositTimeLag, worksCount }) => [depositTimeLag, worksCount])
    .filter(([x]) => x > -150 && x < 150)

  return (
    <TimeLagChart data={actualData} {...passProps}>
      {children}
    </TimeLagChart>
  )
}

export default TimeLagChartProcessor
