import React, { useEffect } from 'react'
import anychart from 'anychart'
import './styles.module.css'

const NetworkGraph = () => {
  useEffect(() => {
    // create data
    const data = {
      nodes: [
        { id: 'Richard', group: 'main' },
        { id: 'Larry', count: 10, group: 'branch', x: 100, y: 200 },
        { id: 'Marta', count: 23, group: 'branch', x: 200, y: 300 },
        { id: 'Jane', count: 42, group: 'branch' },
        { id: 'Norma', count: 42, group: 'branch' },
        { id: 'Frank', count: 32, group: 'branch' },
        { id: 'Brett', count: 15, group: 'branch' },
        { id: 'Tommy', count: 2, group: 'branch' },
      ],
      edges: [
        { from: 'Richard', to: 'Larry' },
        { from: 'Richard', to: 'Marta' },
        { from: 'Richard', to: 'Jane' },
        { from: 'Richard', to: 'Norma' },
        { from: 'Richard', to: 'Frank' },
        { from: 'Richard', to: 'Brett' },
        { from: 'Richard', to: 'Tommy' },
      ],
    }

    // create a chart and set the data
    const chart = anychart.graph(data)

    const edges = chart.edges()

    // set the layout type to 'fixed'

    // prevent zooming the chart with the mouse wheel
    chart.interactivity().zoomOnMouseWheel(false)

    // access nodes
    const nodes = chart.nodes()

    edges.stroke('#666', 1, [8, 2])
    edges.hovered().stroke('#666', 1, [8, 2])

    // set a custom shape for the nodes
    // nodes.normal().shape('rectangle')

    // disable the default appearance of nodes
    nodes.normal().fill(null)
    nodes.hovered().fill(null)
    nodes.selected().fill(null)
    nodes.normal().width(100)
    nodes.normal().height(80)

    // enable the labels of nodes
    chart.nodes().labels().enabled(true)

    chart
      .group('main')
      .shape('circle')
      .stroke('none')
      .height(85)
      .fill('transparent')
      .labels()
      .fontSize(15)

    chart
      .group('branch')
      .shape('rectangle')
      .stroke('none')
      .fill('transparent')
      .labels()
      .fontSize(15)

    chart
      .nodes()
      .labels()
      // eslint-disable-next-line func-names
      .format(function (node) {
        if (node.getData('group') === 'main') {
          return `<div style="width: 85px; height: 85px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; background-color: #B75400; font-size: 16px;">${node.getData(
            'id'
          )}</div>`
        }
        return `<div style="background: #fff">
<div style="width: 100px; height: 40px;  display: flex; align-items: center; justify-content: center; text-align: center; color: #fff; background-color: #B75400; font-size: 16px;">${node.getData(
          'id'
        )}</div>
              <div style="width: 100px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; color: #000; background-color: #F5F5F5; font-size: 16px; margin-top: 4px">${node.getData(
                'count'
              )}</div>
</div>`
      })

    chart.nodes().labels().useHtml(true)

    // set the chart title
    chart.title('Network Graph: Nodes')

    // set the container id
    chart.container('container')

    // initiate drawing the chart
    chart.draw()
  }, [])

  return <div id="container" style={{ width: '100%', height: '100%' }} />
}

export default NetworkGraph
