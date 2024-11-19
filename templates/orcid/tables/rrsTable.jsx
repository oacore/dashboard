import React from 'react'
import { Card } from '@oacore/design'

import styles from '../styles.module.css'
import { Button } from '../../../design'

import texts from 'texts/orcid'

const OrcidTable = () => (
  <Card className={styles.orcidTableWrapper}>
    <div className={styles.buttonGroup}>
      {Object.values(texts.table.actions).map((button) => (
        <Button key={button.action} className={styles.actionButton}>
          {button.name}
        </Button>
      ))}
    </div>
  </Card>
)

export default OrcidTable
