import ReactGA from 'react-ga'

const isProduction = process.env.NODE_ENV === 'production'
let isGAInitialized = false

if (isProduction && GA_TRACKING_CODE) {
  ReactGA.initialize(GA_TRACKING_CODE)
  isGAInitialized = true
}

const logPageView = (url = null) => {
  if (!isGAInitialized) return
  ReactGA.set({ page: url || window.location.pathname })
  ReactGA.pageview(url || window.location.pathname)
}

export default logPageView
