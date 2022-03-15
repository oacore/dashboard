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
  const lastDatesArray = Object.values(dates).map((item) => item.lastHarvesting)

  return lastDatesArray.sort(compareByString)
}

const getDatesByHalfYear = (history) => {
  const lastDates = Object.values(Object.values(history).slice(-7))

  const filteredData = []

  lastDates.map((monthes) => {
    filteredData.push(monthes['06'])
    filteredData.push(monthes[12])
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

  let formattedDates

  switch (activeType) {
    case 'Year': {
      const formatted = arrayOfObj.reduce((acc, obj) => {
        const b = obj.date.split(/\D/)

        if (!acc[b[0]]) acc[b[0]] = {}

        if (!acc[b[0]]) acc[b[0]] = {}
        year = acc[b[0]]

        year.lastHarvesting = obj

        return acc
      }, Object.create(null))
      formattedDates = getDatesByYear(formatted)
      break
    }

    default: {
      const formatted = arrayOfObj.reduce((acc, obj) => {
        const b = obj.date.split(/\D/)

        if (!acc[b[0]]) acc[b[0]] = {}
        year = acc[b[0]]

        if (!year[b[1]]) year[b[1]] = {}
        month = year[b[1]]

        if (!month[obj]) month.lastHarvesting = obj
        return acc
      }, Object.create(null))
      if (activeType === '6 month')
        formattedDates = getDatesByHalfYear(formatted)
      else formattedDates = getDatesByMonth(formatted)

      break
    }
  }
  return formattedDates
}

export default groupDates
