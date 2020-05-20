import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../config'
import moment from 'moment'
import ResponsiveTable from './ResponsiveTable'
import Chart from './Chart'

export default function Dashboard(props) {
  const [loading, setLoading] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const [rows, setRows] = useState([])
  const [cols, setCols] = useState({
    num_comments: 'Comments',
    points: 'Votes',
    upvote: 'Up Vote',
    title: 'Details'
  })

  const loadNewsFeed = async (pgNum) => {
    try {
      // Start loading
      setLoading(true)

      // fetch the records based on pageNum
      const resp = await axios.get(`${config.newsApi}search?page=${pgNum}`)
      if (resp.data && resp.data.hits) {
        const { hits } = resp.data
        const newDt = []
        const crrDate = moment()
        hits.forEach((dt, ind) => {
          const {
            num_comments, points, title, author, url, created_at, objectID
          } = dt

          // few records dont have title, reject those
          if (!title) {
            return
          }

          // From the URL, get domain name
          let domain = ''
          try {
            domain = new URL(url).hostname
          } catch (e) {
            console.log('Error in parsing URl', e)
          }

          // Get Date diff and show in years or days or hours format
          const newsDate = moment(created_at)
          const yearDiff = crrDate.diff(newsDate, 'years')
          const daysDiff = crrDate.diff(newsDate, 'days')
          const hourdiff = crrDate.diff(newsDate, 'hours')

          let dateDiff = ''
          if (yearDiff > 1) {
            dateDiff = `${yearDiff} years`
          } else if (daysDiff > 1) {
            dateDiff = `${daysDiff} days`
          } else {
            dateDiff = `${hourdiff} hours`
          }


          // Check for upvote & hidden in localstorage
          const rowStr = window.localStorage.getItem(objectID)
          let upvote = false
          let isHidden = false
          if (rowStr) {
            upvote = rowStr.indexOf('[upvote]') >= 0
            isHidden = rowStr.indexOf('[hide]') >= 0
          }

          newDt.push({
            id: objectID,
            num_comments,
            points,
            title,
            domain,
            author,
            created_at,
            dateDiff,
            url,
            upvote,
            isHidden
          })
        })

        // Finally set the rows to start using in table & chart
        setRows(newDt)
      }
    } catch (e) {
      console.log('Failed to load news feeds', e)
    } finally {
      // AT last reset the loader
      setLoading(false)
    }
  }

  const updateRowRecord = (id, obj, isUpvote) => {
    // Take all the rows into new Arr
    const newRow = [...rows]
    let rowDt
    for (const ind in newRow) {
      rowDt = newRow[ind]
      if (rowDt.id === id) {
        // For the found record, patch new changes
        if (isUpvote) {
          // Since you have upvoted, increment vote point
          newRow[ind].points++
        }
        newRow[ind] = {
          ...rowDt,
          ...obj
        }
        break
      }
    }

    // Update the state with new Rows to reflect in table & chart
    setRows(newRow)

    // Function to update the news feed using API
    // For this feature to work, backend API needs be setup
    /*
      await axios.put(`${config.newsApi}/item/${rowDt.id}`, rowDt)
      setRows(newRow)
    */
  }

  // Update the localstorage and set hide for clicked row
  const onHideRow = (rowDt) => {
    let rowStr = window.localStorage.getItem(rowDt.id)
    if (!rowStr) {
      rowStr = ''
    }
    rowStr += '[hide]'
    window.localStorage.setItem(rowDt.id, rowStr)
    updateRowRecord(rowDt.id, {
      isHidden: true
    })
  }

  // Update the localstorage and set upvote for clicked row
  const onUpRowVote = (rowDt) => {
    let rowStr = window.localStorage.getItem(rowDt.id)
    if (!rowStr) {
      rowStr = ''
    }
    rowStr += '[upvote]'
    window.localStorage.setItem(rowDt.id, rowStr)
    updateRowRecord(rowDt.id, {
      upvote: true
    }, true)
  }

  // React to changes on path params of dashboard URL
  useEffect(() => {
    let propsPage = props.match.params && props.match.params.pageNum
    if (!propsPage || isNaN(propsPage)) {
      propsPage = 1
    }
    setPageNum(propsPage)
    loadNewsFeed(propsPage)
  }, [props.match.params])


  // Rendering logic of dashboard
  return (
    <div className="App">
      {loading ?
        (<div className="loader" />)
        : (
          <div className="container">
            <ResponsiveTable cols={cols} rows={rows} onUpRowVote={onUpRowVote} onHideRow={onHideRow} />
            <div className="navFooter">
              <Link to={`/dashboard/${(Math.floor(pageNum) + 1)}`}>Next</Link>
              { pageNum > 1 && <Link to={`/dashboard/${(Math.floor(pageNum) - 1)}`}>Prev</Link> }
            </div>
            <Chart rows={rows} />
          </div>
        )}
    </div>
  )
}
