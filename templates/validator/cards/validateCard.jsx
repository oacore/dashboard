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
    <div className={styles.subTitleWrapper}>
      <p className={styles.subTitle}>
        {texts.validator.validator.subTitle.title}
      </p>
      <div className={styles.actionWrapper}>
        {Object.values(texts.validator.validator.subTitle.actions).map(
          (item) => (
            <Button
              onClick={() => {
                handleTextareaChange(item.value)
              }}
              className={styles.linkButton}
            >
              {item.text}
            </Button>
          )
        )}
      </div>
    </div>
    <textarea
      className={styles.textField}
      placeholder="Put your data here"
      value={recordValue}
      onChange={(event) => handleTextareaChange(event.target.value)}
    />
    <div className={styles.inputButton}>
      <Button variant="contained" type="button" onClick={handleValidateClick}>
        {texts.validator.validator.action}
      </Button>
    </div>
  </article>
)

export default ValidateCard
