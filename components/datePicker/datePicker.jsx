import React, { useState } from 'react'

import styles from './styles.module.css'

const DateRangePicker = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const formatDate = (date) => new Date(date).getFullYear()

  const handleStartDateChange = (event) => {
    const date = event.target.value
    setStartDate(date)
    onDateChange(formatDate(date), formatDate(endDate))
  }

  const handleEndDateChange = (event) => {
    const date = event.target.value
    setEndDate(date)
    onDateChange(formatDate(startDate), formatDate(date))
  }

  return (
    <div className={styles.dateWrapper}>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        placeholder="Start Date"
        className={styles.dateInput}
        onFocus={(e) => e.target.showPicker()}
      />
      <span className={styles.separator}>to</span>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        placeholder="End Date"
        min={startDate}
        className={styles.dateInput}
        onFocus={(e) => e.target.showPicker()}
      />
    </div>
  )
}

export default DateRangePicker
