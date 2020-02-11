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
  {
    id: 'plugins/discovery',
    path: 'plugins/discovery',
  },
  {
    id: 'plugins/recommender',
    path: 'plugins/recommender',
  },
]

const configMap = new Map(config.map(item => [item.id, item]))

config.get = (...args) => configMap.get(...args)

export default config
