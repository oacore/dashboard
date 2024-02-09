import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import Markdown from '../markdown'

const DashboardHeader = ({ title, description, identifier, showMore }) => (
  <header
    className={classNames.use(styles.header, {
      [styles.headerPadding]: showMore,
    })}
  >
    <div className={styles.temporaryWrapper}>
      <h1 className={styles.title}>{title}</h1>
      {identifier && <div className={styles.beta}>{identifier}</div>}
    </div>
    {description && (
      <Markdown className={styles.description}>{description}</Markdown>
    )}
    {showMore}
  </header>
)

export default DashboardHeader
