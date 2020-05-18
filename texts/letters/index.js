import Template from '../template'
import requestPremiumSrc from './request-premium.txt'

const subjectSrc = requestPremiumSrc.attributes.subject
const bodySrc = requestPremiumSrc.body

const requestPremium = {
  ...requestPremiumSrc.attributes,

  subject: new Template(subjectSrc),

  // Removing '\n' from the end
  body: new Template(bodySrc.slice(0, bodySrc.length - 1)),
}

export default { requestPremium }
export { requestPremium }
