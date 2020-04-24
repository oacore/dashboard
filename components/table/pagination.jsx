import { formatNumber } from 'utils/helpers'

const Pagination = ({ from = 1, size, total, isAllLoaded = false }) => {
  if (isAllLoaded) return `Showing all ${formatNumber(total)} records`

  // thin spaces between numbers
  const text = `Showing ${from}\u2009-\u2009${formatNumber(size)} records`

  if (total == null) return text

  return `${text} of ${total} records`
}

export default Pagination
