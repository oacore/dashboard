import React from 'react'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'
import Markdown from '../markdown'
import { Message } from '../../design'
import infoLight from '../upload/assets/infoLight.svg'

const DashboardCachedMessage = ({ title, button, description, onClick }) => (
  <Message className={styles.dataErrorWrapper}>
    <div className={styles.dataErrorInnerWrapper}>
      <img className={styles.infoIcon} src={infoLight} alt="description" />
      <div className={styles.tableTitle}>{title}</div>
    </div>
    <Markdown className={styles.infoText}>{description}</Markdown>
    <div className={styles.hideButtonWrapper}>
      <Button
        className={styles.hideButton}
        variant="outlined"
        onClick={onClick}
      >
        {button}
      </Button>
    </div>
  </Message>
)

export default DashboardCachedMessage
