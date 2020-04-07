import React, { useCallback, useRef } from 'react'
import Chart from 'chart.js'

// import styles from './index.css'

const CanvasChart = ({ type, data, options, children, ...canvasProps }) => {
  const chartRef = useRef(null)
  const canvasRef = useCallback(
    (canvasNode) => {
      if (data == null || canvasNode == null) return
      if (chartRef.current != null) chartRef.current.destroy()
      chartRef.current = new Chart(canvasNode, { type, data, options })
    },
    [type, data, options]
  )

  return (
    <canvas ref={canvasRef} {...canvasProps}>
      {children}
    </canvas>
  )
}

const BarChart = ({ labels, data, children, options, ...chartProps }) => {
  const barData = {
    labels,
    datasets: [
      {
        label: 'Deposit time lag',
        data,
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
    <CanvasChart
      type="bar"
      data={barData}
      options={chartOptions}
      {...chartProps}
    >
      {children}
    </CanvasChart>
  )
}

const appendZeros = (dataEntries) =>
  dataEntries.reduce((values, [x, y]) => {
    const [prevX] = values[values.length - 1] ?? [x - 1]
    values.push(
      ...Array.from(Array(x - prevX - 1), (_, i) => [prevX + i + 1, 0])
    )
    values.push([x, y])
    return values
  }, [])

const TimeLagChart = ({ data, children, ...chartProps }) => {
  const actualPoints = data.map(({ depositTimeLag, worksCount }) => [
    depositTimeLag,
    worksCount,
  ])
  const points = appendZeros(actualPoints)
  const labels = points.map(([x]) => x)
  const chartData = points.map(([, y]) => y)
  return (
    <BarChart labels={labels} data={chartData} {...chartProps}>
      {children}
    </BarChart>
  )
}

export default TimeLagChart
