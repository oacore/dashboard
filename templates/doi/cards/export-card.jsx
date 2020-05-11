import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as texts from 'texts/doi'
import ExportButton from 'components/export-button'

const ExportCard = ({ isExportDisabled, doiUrl, enrichmentSize }) => (
  <Card className={styles.exportCard} tag="section">
    <Card.Title tag="h2">{texts.exporting.title}</Card.Title>
    <p>
      {texts.exporting.description.render({
        count: enrichmentSize || '',
      })}
    </p>
    <ExportButton href={doiUrl} disabled={isExportDisabled}>
      {texts.exporting.download}
    </ExportButton>
  </Card>
)

export default ExportCard
