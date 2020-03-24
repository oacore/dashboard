import React from 'react'

import { Numeral } from 'design'

const formatNumber = (n, { locale = 'en-GB' } = {}) =>
  n > 1000
    ? `${(Math.floor(n / 10) / 100).toLocaleString(locale)}\xa0K`
    : n.toLocaleString(locale)

const NumericValue = ({ value, append, caption, diff, ...restProps }) => (
  <Numeral tag="p" {...restProps}>
    <Numeral.Value>
      {typeof value == 'number' ? formatNumber(value) : value}
    </Numeral.Value>
    {append && <Numeral.Appendix>&nbsp;{append}</Numeral.Appendix>}{' '}
    {diff && <Numeral.Diff>{diff}</Numeral.Diff>}{' '}
    <Numeral.Caption>{caption}</Numeral.Caption>
  </Numeral>
)

export default NumericValue
