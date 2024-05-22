import React from 'react'

import styles from '../styles.module.css'

import { Card } from 'design'
import * as texts from 'texts/usrn'
import Markdown from 'components/markdown'

const CoverageCard = () => (
  <Card className={styles.headerCard} tag="section">
    <Card.Title tag="h2">{texts.header.title}</Card.Title>
    <div className={styles.headerDescription}>
      <Markdown>{texts.header.description}</Markdown>
    </div>
  </Card>
)

export default CoverageCard
