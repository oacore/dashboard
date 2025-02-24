import React, { useState } from 'react'

import styles from './styles.module.css'

const DateRangePicker = ({
  onDateChange,
  initialStartDate = '',
  initialEndDate = '',
}) => {
  const today = new Date().toISOString().split('T')[0]
  const defaultStartDate = '2021-01-01'

  const [startDate, setStartDate] = useState(
    initialStartDate || defaultStartDate
  )
  const [endDate, setEndDate] = useState(initialEndDate || today)

  const formatDateForApi = (date) => {
    if (!date) return null
    const formattedDate = new Date(date)
    return `${formattedDate.getFullYear()}-${String(
      formattedDate.getMonth() + 1
    ).padStart(2, '0')}-${String(formattedDate.getDate()).padStart(
      2,
      '0'
    )} 00:00:00`
  }

  const handleStartDateChange = (event) => {
    const date = event.target.value
    setStartDate(date)
    if (date && endDate)
      onDateChange(formatDateForApi(date), formatDateForApi(endDate))
  }

  const handleEndDateChange = (event) => {
    const date = event.target.value
    setEndDate(date)
    if (startDate && date)
      onDateChange(formatDateForApi(startDate), formatDateForApi(date))
  }

  return (
    <div className={styles.dateWrapper}>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        placeholder="Start Date"
        className={styles.dateInput}
        min="2021-01-01"
        max={endDate || today}
        onClick={(e) => e.target.showPicker()}
      />
      <span className={styles.separator}>to</span>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        placeholder="End Date"
        min={startDate || '2021-01-01'}
        max={today}
        className={styles.dateInput}
        onClick={(e) => e.target.showPicker()}
      />
    </div>
  )
}

export default DateRangePicker
