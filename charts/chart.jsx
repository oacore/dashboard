import React, { useCallback, useRef } from 'react'
import Chart from 'chart.js'

// import styles from './index.css'

const createColor = (node, property) => {
  const style = window.getComputedStyle(node)
  const colorList = style.getPropertyValue(property).split(',')

  if (colorList.length === 0) return 'black'
  const color = colorList[0]
  return color
}

const createDataset = (node, data) => {
  const values = data.map(([, y]) => y)

  const dataset = {
    data: values,
    backgroundColor: createColor(node, '--chart-color'),
    hoverBackgroundColor: createColor(node, '--chart-color-hover'),
  }

  return dataset
}

const createConfig = (canvasNode, { type, data, options }) => ({
  type,
  data: {
    labels: data.map(([x]) => x),
    datasets: [createDataset(canvasNode, data)],
  },
  options,
})

const CanvasChart = ({ type, data, options, children, ...canvasProps }) => {
  const chartRef = useRef(null)
  const canvasRef = useCallback(
    (canvasNode) => {
      if (data == null || canvasNode == null) return
      if (chartRef.current != null) chartRef.current.destroy()

      const config = createConfig(canvasNode, { type, data, options })
      const chart = new Chart(canvasNode, config)

      chartRef.current = chart
    },
    [type, data, options]
  )

  return (
    <canvas ref={canvasRef} {...canvasProps}>
      {children}
    </canvas>
  )
}

export default CanvasChart
