const config = [
  {
    id: 'overview',
    path: 'overview',
    icon: 'view-dashboard',
  },
  {
    id: 'indexing',
    path: 'indexing',
    icon: 'sync',
  },
  {
    test: `validator`,
    path: 'validator',
    icon: 'metadata-validator',
  },
  {
    test: `deduplication`,
    path: 'deduplication',
    icon: 'deduplication',
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
    id: 'sdg',
    path: 'sdg',
    icon: 'sdg',
  },
  {
    id: 'das',
    path: 'das',
    icon: 'das',
  },
  {
    id: 'rrsPolicy',
    path: 'rights-retention-strategy',
    icon: 'copy-document',
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
