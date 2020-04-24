import React, { useState, useEffect } from 'react'

import styles from './styles.css'

const StackedVerticalBarChart = React.memo(({ data }) => {
  const [transformedData, setTransformedData] = useState([])

  useEffect(() => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0)
    setTransformedData(
      data.map((el) => ({ ...el, percentage: (el.value / total) * 100 }))
    )
  }, [data])

  return (
    <div>
      <div className={styles.container}>
        {transformedData.map(
          ({
            caption,
            background,
            color = 'var(--black)',
            percentage,
            value,
          }) => (
            <div
              key={caption}
              title={`${caption} – ${value} (${percentage.toFixed(2)}%)`}
              className={styles.bar}
              style={{
                flexBasis: `${percentage}%`,
                background,
                color,
              }}
            >
              <span className={styles.caption}>{caption}</span>
              <span>{value}</span>
            </div>
          )
        )}
      </div>

      <ul className={styles.legend}>
        {transformedData.map(({ caption, background, value }) => (
          <li key={caption} className={styles.label}>
            <div>
              <span className={styles.color} style={{ background }} />
              {caption}
            </div>
            <div className={styles.labelTextRight}>
              <b>{value}</b>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default StackedVerticalBarChart
