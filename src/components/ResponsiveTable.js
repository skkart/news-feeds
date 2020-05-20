import React from 'react'
import '../assets/table.css'
import upvote from '../assets/upvote.png'

// This table is responsive and build specific for news feed UI
export default function ResponsiveTable (props) {

  // Function to get Headers for table
  const head = function() {
    const colMap = props.cols
    const columns = Object.keys(colMap).map((colName) => (
      <th key={colName}>{colMap[colName]}</th>
    ))
    return (
      <tr>{columns}</tr>
    )
  }

  // This function to render Title column for each row
  const renderTitleColumn = function (colName, colMap, row) {
    return (
      <td key={colName} data-label={colMap[colName]}>
        {row.title}
        <span className="split">|</span>
        <a className="domain" href={row.url}>
          {row.domain}
        </a>
        <span className="split">|</span>
        <span className="author">
              by
          {' '}
          <strong>{row.author}</strong>
        </span>
        <span className="split">|</span>
        <span className="date">
          {row.dateDiff}
        </span>
        <span className="split">|</span>
        <span className="hideCell">
          { !row.isHidden ? (<a className="hide pointer" onClick={() => props.onHideRow(row)}>[Hide]</a>) : ''}
        </span>
      </td>
    )
  }

  // This function to render UpVote column for each row
  const renderUpVoteColumn = (colName, colMap, row) => (
    <td key={colName} data-label={colMap[colName]} className="votetd">
      {
        !row.upvote ?
          (<a className="vote pointer" onClick={() => props.onUpRowVote(row)}><img src={upvote} alt="Logo" /></a>) :
          'Voted!'
      }
    </td>
  )

  // Method to render every column based on its type
  const renderRow = (colName, colMap, row) => {
    if (colName === 'title') {
      return renderTitleColumn(colName, colMap, row)
    } else if (colName === 'upvote') {
      return renderUpVoteColumn(colName, colMap, row)
    } else {
      return (
        <td key={colName} data-label={colMap[colName]}>{row[colName]}</td>
      )
    }

  }

  // Function to render rows for table
  const rows = function() {
    const colMap = props.cols
    return props.rows.map((row, ind) => {
      const values = Object.keys(colMap).map((colName, colKey) => (
        renderRow(colName, colMap, row)
      ))
      return (
        <tr key={row.id || ind} className={row.isHidden ? 'hideRow' : ''}>{values}</tr>
      )
    })
  }

  return (
    <div className="table_container">
      <table className="responsive-table">
        <thead>
          {head()}
        </thead>
        <tbody>
          {rows()}
        </tbody>
      </table>
    </div>
  )
}
