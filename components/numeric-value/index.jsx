import React from 'react'

import { Numeral } from 'design'
import { formatNumber } from 'utils/helpers'

const NumericValue = ({
  value,
  append,
  caption,
  diff,
  title,
  notation = 'compact',
  compactDisplay,
  maximumFractionDigits = 2,
  bold,
  ...htmlProps
}) => (
  <Numeral {...htmlProps}>
    <Numeral.Title>{title}</Numeral.Title>
    <Numeral.Value bold={bold}>
      {typeof value == 'number'
        ? formatNumber(value, {
            notation,
            compactDisplay,
            maximumFractionDigits,
          })
        : value}
    </Numeral.Value>
    {append && <Numeral.Appendix bold={bold}>{append}</Numeral.Appendix>}
    {diff && <Numeral.Diff>{diff}</Numeral.Diff>}
    <Numeral.Caption>{caption}</Numeral.Caption>
  </Numeral>
)

export default NumericValue
export { formatNumber }
