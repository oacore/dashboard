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
    test: /\/content/,
    path: 'content',
    icon: 'file-document',
  },
  {
    test: /\/oa-compliance/,
    path: 'oa-compliance',
    icon: 'calendar-check',
    children: [
      {
        test: /\/deposit-compliance/,
        path: 'deposit-compliance',
        id: 'deposit-compliance',
        value: 'REF 2029',
      },
      {
        test: /\/validator/,
        path: 'validator',
        id: 'validator',
        value: 'Metadata validator',
      },
      {
        test: /\/usrn/,
        path: 'usrn',
        id: 'usrn',
        value: 'Desirable Characteristics',
      },
    ],
  },
  {
    test: /\/enrichments/,
    path: 'enrichments',
    icon: 'enrichment',
    children: [
      {
        test: /\/doi/,
        path: 'doi',
        id: 'doi',
        value: 'DOI',
      },
      {
        test: /\/orcid/,
        path: 'orcid',
        id: 'orcid',
        value: 'ORCID',
      },
      {
        test: /\/sdg/,
        path: 'sdg',
        id: 'sdg',
        value: 'SDG Insights',
      },
      {
        test: /\/rights-retention-strategy/,
        path: 'rights-retention-strategy',
        id: 'rights-retention-strategy',
        value: 'RRS Policy',
      },
      {
        test: /\/das/,
        path: 'das',
        id: 'das',
        value: 'DAS identification',
      },
      {
        test: /\/research-software/,
        path: 'research-software',
        id: 'research-software',
        value: 'Research software',
      },
      {
        test: /\/deduplication/,
        path: 'deduplication',
        id: 'deduplication',
        value: 'Versions/duplicates',
      },
    ],
  },
  // {
  //   test: /\/usrn/,
  //   path: 'usrn',
  //   icon: 'file-check',
  // },
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
