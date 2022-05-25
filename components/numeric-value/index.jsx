import React from 'react'

import { Numeral } from 'design'
import { formatNumber } from 'utils/helpers'

const NumericValue = ({
  value,
  append,
  caption,
  diff,
  notation = 'compact',
  compactDisplay,
  ...htmlProps
}) => (
  <Numeral {...htmlProps}>
    <Numeral.Value>
      {typeof value == 'number'
        ? formatNumber(value, { notation, compactDisplay })
        : value}
    </Numeral.Value>
    {append && <Numeral.Appendix>{append}</Numeral.Appendix>}{' '}
    {diff && <Numeral.Diff>{diff}</Numeral.Diff>}{' '}
    <Numeral.Caption>{caption}</Numeral.Caption>
  </Numeral>
)

export default NumericValue
export { formatNumber }
