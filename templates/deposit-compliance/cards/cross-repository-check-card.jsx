import React from 'react'

import { Card } from 'design'
import * as texts from 'texts/depositing'
import { formatNumber } from 'utils/helpers'
import ExportButton from 'components/export-button'

const CrossRepositoryCheckCard = ({
  crossDepositLag,
  crossDepositLagCsvUrL,
}) => (
  <Card id="cross-repository-check" tag="section">
    <Card.Title tag="h2">{texts.crossRepositoryCheck.title}</Card.Title>
    <Card.Description>
      {texts.crossRepositoryCheck.description}
    </Card.Description>
    <p>
      {crossDepositLag
        ? texts.crossRepositoryCheck.body.render({
            nonCompliantCount: formatNumber(crossDepositLag.nonCompliantCount),
            recordsInAnotherRepository: formatNumber(
              crossDepositLag.possibleBonusCount
            ),
          })
        : 'Loading data'}
    </p>
    <ExportButton href={crossDepositLagCsvUrL}>
      {texts.crossRepositoryCheck.download}
    </ExportButton>
  </Card>
)

export default CrossRepositoryCheckCard
