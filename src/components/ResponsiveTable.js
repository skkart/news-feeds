import React from 'react'
import '../assets/table.css'

export default function ResponsiveTable (props) {
  const head = function() {
    const colMap = props.cols
    const columns = Object.keys(colMap).map((colName) => (
      <th key={colName}>{colMap[colName]}</th>
    ))
    return (
      <tr>{columns}</tr>
    )
  }

  const rows = function() {
    const colMap = props.cols
    return props.rows.map((row, ind) => {
      const values = Object.keys(colMap).map((colName, colKey) => (
        <td key={colName} data-label={colMap[colName]}>{row[colName]}</td>
      ))
      return (
        <tr key={row.id || ind}>{values}</tr>
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