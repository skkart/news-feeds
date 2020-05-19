import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/dashboard/:pageNum" component={Dashboard} />
      </div>
    </BrowserRouter>

  )
}

export default App
