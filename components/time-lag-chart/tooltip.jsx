import React from 'react'

const Tooltip = ({ label, aggregationSize }) => {
  const index = parseInt(label, 10) * aggregationSize
  return (
    <div>
      <b>Deposit time lag</b>
      <br />
      {index}/{index + aggregationSize - 1}
    </div>
  )
}

export default Tooltip
