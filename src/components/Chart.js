import React, { useState, useEffect, useRef } from 'react'

export default function Chart(props) {
  const [gChart, setGChart] = useState(null)
  const chartEle = useRef(null)

  const loadGoogleChart = () => {
    const gTable = new window.google.visualization.DataTable()
    gTable.addColumn('string', 'ID')
    gTable.addColumn('number', 'Votes')


    // Loop data arr and return filtered data like [Date, Series Data]
    const rows = []
    props.rows.forEach(record => {
      if (!record.isHidden) {
        rows.push([record.id, record.points])
      }
    })
    gTable.addRows(rows)

    let ch = gChart
    if (!ch) {
      // Load Google charts visualization for line
      ch = new window.google.visualization.LineChart(chartEle.current)
      setGChart(ch)
    }

    // Call this draw() every time for every row change
    ch.draw(gTable, {
      backgroundColor: '#fffdd0',
      legend: {
        position: 'none',
        alignment: 'center',
      },
      hAxis: {
        title: 'ID',
        slantedText: true,
        slantedTextAngle: 65,
        titleTextStyle: {
          color: '#0000',
          fontSize: '17px',
          fontWeight: 600,
          bold: true,
          italic: true
        }
      },
      vAxis: {
        title: 'Votes',
        titleTextStyle: {
          color: '#0000',
          fontSize: '17px',
          fontWeight: 600,
          bold: true,
          italic: true
        }
      }
    })
  }

  useEffect(() => {
    // On window resize redraw the chart
    window.addEventListener('resize', () => loadGoogleChart())
  }, [])

  // On change of rows, Update the chart & redraw
  useEffect(() => {
    loadGoogleChart()
  }, [props.rows])

  return (
    <div className="chartPanel">
      <div ref={chartEle} className="g-chart" />
    </div>
  )
}