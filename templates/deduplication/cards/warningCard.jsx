import React from 'react'
import { Button } from '@oacore/design/lib/elements'
import { classNames } from '@oacore/design/lib/utils'

import { Message } from '../../../design'
import styles from '../styles.module.css'
import info from '../../../components/upload/assets/info.svg'
import Markdown from '../../../components/markdown'

const CompareWarning = ({
  title,
  show,
  hide,
  description,
  setText,
  activeText,
}) => (
  <div>
    <div
      className={classNames.use(styles.tableTitleWrapper, {
        [styles.noWrapper]: !title,
      })}
    >
      <div className={styles.tableTitle}>{title}</div>
      {!activeText && (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          onClick={() => setText(true)}
          className={classNames.use(styles.showWrapper, {
            [styles.noShowWrapper]: !title,
          })}
        >
          <span className={styles.tableTitle}>{show}</span>
          <img className={styles.showIcon} src={info} alt="description" />
        </div>
      )}
    </div>
    {activeText && (
      <Message className={styles.dataErrorWrapper}>
        <div className={styles.dataErrorInnerWrapper}>
          <img className={styles.infoIcon} src={info} alt="description" />
          <Markdown className={styles.infoText}>{description}</Markdown>
        </div>
        <div className={styles.hideButtonWrapper}>
          <Button
            className={styles.hideButton}
            onClick={() => setText(false)}
            variant="outlined"
          >
            {hide}
          </Button>
        </div>
      </Message>
    )}
  </div>
)

export default CompareWarning
