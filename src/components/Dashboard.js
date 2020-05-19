import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ResponsiveTable from './ResponsiveTable'
import config from '../config'

export default function Dashboard(props) {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [cols, setCols] = useState({
    num_comments: 'Comments',
    points: 'Votes',
    Upvote: 'myvot',
    title: 'Details'
  })

  const loadNewsFeed = async (pageNum) => {
    try {
      setLoading(true)
      const resp = await axios.get(`${config.newsApi}search?page=${pageNum}`)
      if (resp.data && resp.data.hits) {
        const { hits } = resp.data
        console.log(hits)
        setRows(hits)
      }
    } catch (e) {
      console.log('Failed to load user chats', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let pageNum = props.match.params && props.match.params.pageNum
    if (!pageNum || isNaN(pageNum)) {
      pageNum = 1
    }
    loadNewsFeed(pageNum)
  }, [props.match.params])
  // const cols = {
  //   payment: 'Payment',
  //   date: 'Processing Date',
  //   amount: 'Amount',
  //   payee: 'Payee'
  // }
  //
  // const rows = [{
  //   payment: 'Payment #1',
  //   date: 'March 20, 1989',
  //   amount: '$29.99',
  //   payee: 'John Smith'
  // }, {
  //   payment: 'Payment #2',
  //   date: 'March 22, 1989',
  //   amount: '$40.00',
  //   payee: 'Brandon Drew'
  // }, {
  //   payment: 'Payment #3',
  //   date: 'April 2, 1989',
  //   amount: '$9.50',
  //   payee: 'Jackie Chan'
  // }]

  return (
    <div className="App">
      {loading ?
        <div className="loader" />
        :
        <ResponsiveTable cols={cols} rows={rows} />
      }
    </div>
  )
}