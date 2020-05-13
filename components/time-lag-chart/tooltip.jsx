import React from 'react'

import styles from './styles.module.css'

import { formatNumber } from 'utils/helpers'

const matchX = (targetX) => ([x]) => targetX === x

const Tooltip = ({ active, label, data }) => {
  if (!active) return null

  const lag = parseInt(label, 10)
  const formattedLag = formatNumber(Math.abs(lag))
  const lagSuffix = Math.abs(lag) === 1 ? '' : 's'
  let lagText = 'in the date of publishing'
  if (lag < 0)
    lagText = `${formattedLag} day${lagSuffix} before the publication`
  else if (lag > 0)
    lagText = `${formattedLag} day${lagSuffix} after the publication`

  const [, count] = data.find(matchX(lag)) ?? [0, 0]

  return (
    <div className={styles.tooltip}>
      {formatNumber(count)} works deposited
      <br />
      {lagText}
    </div>
  )
}

export default Tooltip
