import React from 'react'

import styles from '../styles.module.css'
import { Button, Card } from '../../../design'
import { validator } from '../../../texts/validator'

const ValidateCard = ({ handleValidateClick }) => (
  <article className={styles.content}>
    <Card.Title tag="h2">{validator.validator.title}</Card.Title>
    <textarea className={styles.textField} placeholder="Put your data here" />
    <div className={styles.inputButton}>
      <Button
        variant="contained"
        type="button"
        onClick={() => handleValidateClick()}
      >
        {validator.validator.action}
      </Button>
    </div>
  </article>
)

export default ValidateCard
