const config = [
  {
    id: 'overview',
    path: 'overview',
    icon: 'dashboard',
  },
  {
    id: 'content',
    path: 'content',
    icon: 'document',
  },
  {
    id: 'depositDates',
    path: 'deposit-dates',
    icon: 'calendar-check',
  },
  {
    id: 'plugins',
    path: 'plugins',
    icon: 'puzzle',
    children: [
      {
        id: 'plugins/discovery',
        path: 'plugins/discovery',
      },
      {
        id: 'plugins/recommender',
        path: 'plugins/recommender',
      },
    ],
  },
].flatMap(x => [x, ...(x.children || [])])

const configMap = new Map(config.map(item => [item.id, item]))

config.get = (...args) => configMap.get(...args)

export default config
