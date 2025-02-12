import React, { useEffect, useState } from 'react'

import styles from './styles.module.css'

const DateRangePicker = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const formatDate = (date) => date

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const handleClick = (event) => {
    event.target.showPicker()
  }

  useEffect(() => {
    if (startDate?.length === 10 && endDate?.length === 10)
      onDateChange(formatDate(startDate), formatDate(endDate))
  }, [startDate, endDate])

  return (
    <div className={styles.dateWrapper}>
      <input
        type="date"
        value={startDate || ''}
        onChange={handleStartDateChange}
        onClick={handleClick}
        placeholder="Start Date"
        className={styles.dateInput}
        min="2020-01-01"
      />
      <span className={styles.separator}>to</span>
      <input
        type="date"
        value={endDate || ''}
        onChange={handleEndDateChange}
        onClick={handleClick}
        placeholder="End Date"
        min={startDate || '2020-01-01'}
        className={styles.dateInput}
      />
    </div>
  )
}

export default DateRangePicker
