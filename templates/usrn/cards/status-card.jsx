import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as texts from 'texts/usrn'
import Markdown from 'components/markdown'

const CoverageCard = () => (
  <Card tag="section">
    <Card.Title tag="h2">{texts.status.titleFirst}</Card.Title>
    <div className={styles.headerDescription}>
      <Markdown>{texts.status.descriptionFirst}</Markdown>
    </div>
  </Card>
)

export default CoverageCard
