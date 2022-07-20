import { initialize, set, pageview } from 'react-ga'

const isProduction = process.env.NODE_ENV === 'production'
let isGAInitialized = false

if (isProduction && process.env.GA_TRACKING_CODE) {
  initialize(process.env.GA_TRACKING_CODE, {
    siteSpeedSampleRate: 100,
  })
  isGAInitialized = true
}

export const logPageView = (url = null) => {
  if (!isGAInitialized) return
  set({ page: url || window.location.pathname })
  pageview(url || window.location.pathname)
}

export default {
  logPageView,
}
