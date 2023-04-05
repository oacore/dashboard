const config = [
  {
    id: 'overview',
    path: 'overview',
    icon: 'view-dashboard',
  },
  {
    id: 'harvesting',
    path: 'harvesting',
    icon: 'sync',
  },
  {
    test: `validator`,
    path: 'validator',
    icon: 'metadata-validator',
  },
  {
    id: 'content',
    path: 'content',
    icon: 'file-document',
  },
  {
    id: 'depositCompliance',
    path: 'deposit-compliance',
    icon: 'calendar-check',
  },
  {
    id: 'doi',
    path: 'doi',
    icon: 'barcode',
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
  {
    id: 'membership',
    path: 'membership',
    icon: 'account-group',
  },
  {
    id: 'settings',
    path: 'settings',
    icon: 'cog',
  },
]

const configMap = new Map(config.map((item) => [item.id, item]))

config.get = (...args) => configMap.get(...args)
config.find = (...args) =>
  config.flatMap((x) => [x, ...(x.children || [])]).find(...args)

export default config
