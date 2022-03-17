const compareByString = (a, b) => {
  if (a.date < b.date) return -1
  if (a.date > b.date) return 1
  return 0
}

const getDatesByMonth = (history) => {
  const dates = {}

  // Take last item
  const lastYear =
    history[Object.keys(history)[Object.keys(history).length - 1]]

  // Take last item - 1
  if (Object.keys(lastYear).length < 12) {
    const prevLastYear =
      history[Object.keys(history)[Object.keys(history).length - 2]]

    Object.assign(dates, prevLastYear, lastYear)
  }
  const lastDatesArray = Object.values(dates)

    .map((item) => item.lastHarvesting)
    .filter(Boolean)

  return lastDatesArray.sort(compareByString)
}

const getDatesByHalfYear = (history) => {
  const lastDates = Object.values(Object.values(history).slice(-7))

  const filteredData = []

  lastDates.map((monthes) => {
    filteredData.push(monthes['06'])
    filteredData.push(monthes['12'])
    return null
  })

  const halfYearDates = filteredData
    .filter(Boolean)
    .map((item) => item.lastHarvesting)

  return halfYearDates.sort(compareByString)
}

const getDatesByYear = (history) => {
  const dates = Object.values(history).slice(-12)
  const lastDatesArray = Object.values(dates).map((item) => item.lastHarvesting)
  return lastDatesArray.sort(compareByString)
}

const groupDates = (data, activeType) => {
  const arrayOfObj =
    data &&
    Object.entries(data).map((e) => ({
      date: e[0],
      value: e[1],
    }))

  let year
  let month
  let weekNum
  let formattedDates

  const historyDates = arrayOfObj.reduce((acc, obj) => {
    const b = obj.date.split(/\D/)

    weekNum = `0${Math.ceil(b[2] / 7)}`

    if (!acc[b[0]]) acc[b[0]] = {}
    year = acc[b[0]]
    year.lastHarvesting = obj

    if (!year[b[1]]) year[b[1]] = {}
    month = year[b[1]]

    if (!month[obj]) month.lastHarvesting = obj

    if (!month[obj]) month[weekNum] = []
    // Add object to  week
    month[weekNum].push(obj)

    return acc
  }, Object.create(null))

  switch (activeType) {
    case 'Year': {
      formattedDates = getDatesByYear(historyDates)
      break
    }
    case 'Month': {
      formattedDates = getDatesByMonth(historyDates)
      break
    }

    case '6 month': {
      formattedDates = getDatesByHalfYear(historyDates)
      break
    }
    default:
      return formattedDates
  }

  return formattedDates
}

export default groupDates
