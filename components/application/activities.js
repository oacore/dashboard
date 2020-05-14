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
    test: /\/issues/,
    path: 'issues',
    icon: 'alert-circle',
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
    test: /\/doi/,
    path: 'doi',
    icon: 'barcode',
  },
  {
    test: /\/plugins/,
    path: 'plugins',
    icon: 'puzzle',
    children: [
      {
        test: /\/discovery/,
        path: 'discovery',
      },
      {
        test: /\/recommender/,
        path: 'recommender',
      },
    ],
  },
  {
    test: /\/settings/,
    path: 'settings',
    icon: 'cog',
  },
])

export default config
