import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as textsUSRN from 'texts/usrn'
import * as textsFAIR from 'texts/fair'
import Markdown from 'components/markdown'

const CoverageCard = ({ usrnParams }) => {
  const { template } = usrnParams

  let texts = textsFAIR
  if (template === 'usrn') texts = textsUSRN

  return (
    <Card className={styles.headerCard} tag="section">
      <Card.Title className={styles.headerTitle}>
        {texts.header.title}
      </Card.Title>
      <div className={styles.headerDescription}>
        <Markdown>{texts.header.description}</Markdown>
      </div>
    </Card>
  )
}

export default CoverageCard
