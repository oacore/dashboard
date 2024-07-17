import React, { useEffect, useRef } from 'react'
import anychart from 'anychart'

const NetworkGraph = ({ data }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      // create a chart from the graphData property of the data prop
      const chart = anychart.graph(data.chart.graphData)

      // set the title
      chart.title('Network Graph showing the battles in Game of Thrones')

      // access nodes
      const nodes = chart.nodes()

      // disable the default appearance of nodes
      nodes.normal().fill(null)
      nodes.hovered().fill(null)
      nodes.selected().fill(null)

      // enable the labels of nodes
      chart.nodes().labels().enabled(true)

      chart
        .nodes()
        .labels()
        // eslint-disable-next-line func-names
        .format(function (node) {
          return `<div style="background-color: brown; color: white; padding: 5px; text-align: center;">
            <div>${node.getData('id')}</div>
            <div style="background-color: red;">${node.getData('count')}</div>
          </div>`
        })
      chart.nodes().labels().useHtml(true)
      chart.nodes().labels().fontSize(12)
      chart.nodes().labels().fontWeight(600)

      // draw the chart
      chart.container(containerRef.current)
      chart.draw()
    }
  }, [data])

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
}

export default NetworkGraph
