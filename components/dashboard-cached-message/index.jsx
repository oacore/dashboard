import React from 'react'

import styles from './styles.module.css'
import { Message } from '../../design'
import infoLight from '../upload/assets/infoLight.svg'

const DashboardCachedMessage = ({ title }) => (
  <Message className={styles.dataErrorWrapper}>
    <div className={styles.dataErrorInnerWrapper}>
      <img className={styles.infoIcon} src={infoLight} alt="description" />
      <div className={styles.tableTitle}>{title}</div>
    </div>
  </Message>
)

export default DashboardCachedMessage
