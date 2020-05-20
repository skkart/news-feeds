import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import config from './config'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('check for news API', async () => {
  try {
    const resp = await axios.get(`${config.newsApi}search?page=${pgNum}`)
    if (resp.data && resp.data.hits) {
      console.log('Passed API test')
    }
  } catch (e) {
    console.log('Failed news API')
  }
})
