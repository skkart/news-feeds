import React, { useState, useEffect } from 'react'
import { HashRouter, Route} from 'react-router-dom'
import './assets/App.css'
import Dashboard from './components/Dashboard'

function App(props) {
  // State to track on google chart is loaded
  const [googleChartLoaded, setGoogleChartLoaded] = useState(false)

  useEffect(() => {
    const { google } = window
    if (google && google.charts) {
      // Load Charts for only Line
      google.charts.load('current', { packages: ['corechart'] })
      google.charts.setOnLoadCallback(() => {
        setGoogleChartLoaded(true)
      })
    } else {
      // failed to load the google chart
      // Alert the user
      console.log('Problem in loading Google Charts. Please check!!!')
    }
  }, [])

  // Dont show dashboard until google chart is fetched
  if (!googleChartLoaded) {
    return (
      <div className="App"><div className="loader" /></div>
    )
  }

  return (
    <HashRouter>
      <div className="container">
        <Route exact={true} path="/" component={Dashboard} />
        <Route exact path="/dashboard/:pageNum" component={Dashboard} />
      </div>
    </HashRouter>
  )
}

export default App
