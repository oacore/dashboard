import React from 'react'

import Chart from './chart'

const BarChart = ({ data, children, options, ...chartProps }) => {
  const labels = data.map(([x]) => x)
  const values = data.map(([, y]) => y)

  // eslint-disable-next-line
  const barData = {
    labels,
    datasets: [
      {
        label: 'Deposit time lag',
        data: values,
        backgroundColor: '#8bc34a',
      },
    ],
  }

  const chartOptions = {
    scales: {
      xAxes: [
        {
          // type: 'linear',
          gridLines: {
            // display: false,
          },
          ticks: {
            stepSize: 1,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          display: false,
          gridLines: {
            display: false,
          },
        },
      ],
    },
    ...options,
  }

  return (
    <Chart type="bar" data={data} options={chartOptions} {...chartProps}>
      {children}
    </Chart>
  )
}

export default BarChart
