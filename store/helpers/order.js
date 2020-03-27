const getOrder = columnOrder =>
  Object.entries(columnOrder)
    .map(([property, direction]) => [property, (direction || '').toLowerCase()])
    .filter(([, direction]) => direction === 'asc' || direction === 'desc')
    .map(([property, direction]) => `${property}:${direction}`)
    .join(';')

export default getOrder
