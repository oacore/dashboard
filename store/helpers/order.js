const getOrder = columnOrder =>
  Object.entries(columnOrder)
    .filter(i => i[1])
    .map(([k, v]) => `${k}:${v}`)
    .join(';')

export default getOrder
