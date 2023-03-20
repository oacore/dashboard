import React from 'react'

import styles from '../styles.module.css'
import { Button, Card } from '../../../design'

import texts from 'texts/validator'

const ValidateCard = ({
  handleValidateClick,
  handleTextareaChange,
  recordValue,
}) => (
  <article className={styles.content}>
    <Card.Title tag="h2">{texts.validator.validator.title}</Card.Title>
    <textarea
      className={styles.textField}
      placeholder="Put your data here"
      value={recordValue}
      onChange={handleTextareaChange}
    />
    <div className={styles.inputButton}>
      <Button variant="contained" type="button" onClick={handleValidateClick}>
        {texts.validator.validator.action}
      </Button>
    </div>
  </article>
)

export default ValidateCard
