import Template from '../template'
import { requestPremium as requestPremiumLetter } from '../letters'
import paymentRequiredSrc from './payment-required.md'

const paymentRequired = new Template(paymentRequiredSrc.body)

export default { paymentRequired, requestPremiumLetter }
export { paymentRequired, requestPremiumLetter }
