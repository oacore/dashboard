// eslint-disable-next-line import/no-extraneous-dependencies
import ReactGA from 'react-ga4'

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
  ReactGA.send({
    hitType: 'pageview',
    page: url || window.location.pathname,
    title: window.location.pathname,
  })
}

export default {
  logPageView,
}
