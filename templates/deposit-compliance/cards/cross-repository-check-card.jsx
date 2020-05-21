import React from 'react'

import { Card } from 'design'
import * as texts from 'texts/depositing'
import { formatNumber } from 'utils/helpers'
import ExportButton from 'components/export-button'
import Markdown from 'components/markdown'

const Content = ({ nonCompliantCount, differentCount, exportUrl }) => {
  const template =
    texts.crossRepositoryCheck[differentCount ? 'success' : 'failure']
  const text = template.render({
    nonCompliantCount: formatNumber(nonCompliantCount),
    recordsInAnotherRepository: formatNumber(differentCount),
  })

  return (
    <>
      <Markdown>{text}</Markdown>
      <ExportButton href={exportUrl}>
        {texts.crossRepositoryCheck.download}
      </ExportButton>
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
        differentCount={crossDepositLag.possibleBonusCount}
        exportUrl={crossDepositLagCsvUrl}
      />
    ) : (
      'Loading data'
    )}
  </Card>
)

export default CrossRepositoryCheckCard
