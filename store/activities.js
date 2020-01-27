const config = [
  {
    id: 'overview',
    path: 'overview',
  },
  {
    id: 'content',
    path: 'content',
  },
  {
    id: 'depositDates',
    path: 'deposit-dates',
  },
  {
    id: 'plugins',
    path: 'plugins',
  },
]

const configMap = new Map(config.map(item => [item.id, item]))

config.get = (...args) => configMap.get(...args)

export default config
