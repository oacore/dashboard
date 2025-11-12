// Resolves child routes and appends parents to the configuration objects
const createRoute = (current, parent) => {
  const result = { ...current, parent }

  result.test = (str) =>
    (parent?.test?.call(str) || true) && current.test.test(str)

  if (parent?.path) result.path = [parent.path, current.path].join('/')

  if (current.children) {
    result.children = current.children.map((child) =>
      createRoute(child, result)
    )
  }

  return result
}

class RouteConfig {
  constructor(init) {
    this.routes = init
      .map((route) => createRoute(route, null))
      .flatMap((route) => [...(route.children || []), route])
  }

  get(name) {
    return this.routes.find((route) => route.path === name)
  }

  find(url) {
    return this.routes.find((route) => route.test(url))
  }
}

const config = new RouteConfig([
  {
    test: /\/overview/,
    path: 'overview',
    icon: 'view-dashboard',
  },
  {
    test: /\/indexing/,
    path: 'indexing',
    icon: 'sync',
  },
  {
    test: /\/validator/,
    path: 'validator',
    icon: 'metadata-validator',
  },
  {
    test: /\/deduplication/,
    path: 'deduplication',
    icon: 'deduplication',
  },
  {
    test: /\/content/,
    path: 'content',
    icon: 'file-document',
  },
  {
    test: /\/deposit-compliance/,
    path: 'deposit-compliance',
    icon: 'calendar-check',
  },
  {
    test: /\/sdg/,
    path: 'sdg',
    icon: 'sdg',
  },
  {
    test: /\/das/,
    path: 'das',
    icon: 'das',
  },
  {
    test: /\/rights-retention-strategy/,
    path: 'rights-retention-strategy',
    icon: 'copy-document',
  },
  {
    test: /\/research-software/,
    path: 'research-software',
    icon: 'sw',
  },
  {
    test: /\/doi/,
    path: 'doi',
    icon: 'barcode',
  },
  {
    test: /\/orcid/,
    path: 'orcid',
    icon: 'orcid',
  },
  {
    test: /\/usrn/,
    path: 'usrn',
    icon: 'file-check',
  },
  // {
  //   test: /\/fair/,
  //   path: 'fair',
  //   icon: 'metadata-validator',
  // },
  {
    test: /\/plugins/,
    path: 'plugins',
    icon: 'puzzle',
  },
  {
    test: /\/membership/,
    path: 'membership',
    icon: 'account-group',
    children: [
      {
        test: /\/discovery/,
        path: 'membership-type',
        id: 'membership-type',
        value: 'My membership',
      },
      {
        test: /\/recommender/,
        path: 'documentation',
        id: 'documentation',
        value: 'Documentations',
      },
      {
        test: /\/badges/,
        path: 'badges',
        id: 'badges',
        value: 'CORE badges',
      },
    ],
  },
  {
    test: /\/settings/,
    path: 'settings',
    icon: 'cog',
    children: [
      {
        test: /\/discovery/,
        path: 'organisational',
        id: 'organisational',
        value: 'Organisational',
      },
      {
        test: /\/recommender/,
        path: 'repository',
        id: 'repository',
        value: 'Repository',
      },
      {
        test: /\/notifications/,
        path: 'notifications',
        id: 'notifications',
        value: 'Notifications',
      },
    ],
  },
])

export default config
