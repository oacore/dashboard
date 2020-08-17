import React from 'react'

import { PaymentRequiredError } from 'store/errors'
import { Card } from 'design'
import ExportButton from 'components/export-button'
import Markdown from 'components/markdown'
import { PaymentRequiredNote } from 'modules/billing'
import * as texts from 'texts/depositing'
import { formatNumber } from 'utils/helpers'

const Content = ({ nonCompliantCount, differentCount, exportUrl }) => {
  const templateName = differentCount > 0 ? 'success' : 'failure'
  const template = texts.crossRepositoryCheck[templateName]
  const text = template.render({
    nonCompliantCount: nonCompliantCount ? formatNumber(nonCompliantCount) : '',
    recordsInAnotherRepository: formatNumber(differentCount),
  })

  return (
    <>
      <Markdown>{text}</Markdown>
      {differentCount > 0 && (
        <ExportButton href={exportUrl}>
          {texts.crossRepositoryCheck.download}
        </ExportButton>
      )}
    </>
  )
}

const CrossRepositoryCheckCard = ({
  crossDepositLag,
  crossDepositLagCsvUrl,
}) => (
  <Card id="cross-repository-check" tag="section">
    <Card.Title tag="h2">{texts.crossRepositoryCheck.title}</Card.Title>
    <Card.Description>
      {texts.crossRepositoryCheck.description}
    </Card.Description>
    {crossDepositLag ? (
      <Content
        nonCompliantCount={crossDepositLag.nonCompliantCount}
        differentCount={crossDepositLag.bonusCount}
        exportUrl={crossDepositLagCsvUrl}
      />
    ) : (
      'Loading data'
    )}
    {crossDepositLag?.error instanceof PaymentRequiredError && (
      <PaymentRequiredNote
        template={texts.crossRepositoryCheck.paymentRequired}
      />
    )}
  </Card>
)

export default CrossRepositoryCheckCard
