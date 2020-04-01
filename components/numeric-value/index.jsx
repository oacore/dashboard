import React from 'react'

import { Numeral } from 'design'

const formatNumber = (
  number,
  {
    locale = 'en-GB',
    precision = 2,
    spacer = '\xa0', // tiny space, smaller then regular
  } = {}
) => {
  const divisionMap = [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ]

  const [divider, appendix] = divisionMap.find(
    ([rank]) => Math.abs(Math.floor(number / rank)) > 0
  ) ?? [1, '']
  const actualNumber =
    Math.floor((number / divider) * 10 ** precision) / 10 ** precision
  return [actualNumber.toLocaleString(locale), appendix]
    .filter((x) => x) // drop empty appendix
    .join(spacer)
}

const NumericValue = ({ value, append, caption, diff, ...restProps }) => (
  <Numeral tag="p" {...restProps}>
    <Numeral.Value>
      {typeof value == 'number' ? formatNumber(value) : value}
    </Numeral.Value>
    {append && <Numeral.Appendix>{append}</Numeral.Appendix>}{' '}
    {diff && <Numeral.Diff>{diff}</Numeral.Diff>}{' '}
    <Numeral.Caption>{caption}</Numeral.Caption>
  </Numeral>
)

export default NumericValue
export { formatNumber }
