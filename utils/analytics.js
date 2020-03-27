import ReactGA from 'react-ga'

const isProduction = process.env.NODE_ENV === 'production'
let isGAInitialized = false

if (isProduction && process.env.GA_TRACKING_CODE) {
  ReactGA.initialize(process.env.GA_TRACKING_CODE, {
    siteSpeedSampleRate: 100,
  })
  isGAInitialized = true
}

export const logPageView = (url = null) => {
  if (!isGAInitialized) return
  ReactGA.set({ page: url || window.location.pathname })
  ReactGA.pageview(url || window.location.pathname)
}

export const logTiming = options => {
  ReactGA.timing(options)
}

export default {
  logPageView,
  logTiming,
}
