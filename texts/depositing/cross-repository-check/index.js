import Template from '../../template'
import attributes from './index.yml'
import successSrc from './success.md'
import failureSrc from './failure.md'
import paymentRequiredSrc from './payment-required.md'

const success = new Template(successSrc.body)
const failure = new Template(failureSrc.body)
const paymentRequired = new Template(paymentRequiredSrc.body)

export default {
  ...attributes,
  success,
  failure,
  paymentRequired,
}
