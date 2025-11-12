import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import cog from '../upload/assets/cog.svg'
import styles from './styles.module.css'

const DashboardSettingsHeader = ({
  title,
  description,
  identifier,
  children,
  isDescriptionVisible = false,
  toggleDescription,
}) => (
  <header
    className={classNames.use(styles.header, {
      [styles.headerPadding]: isDescriptionVisible,
    })}
  >
    <div className={styles.temporaryWrapper}>
      <h1 className={styles.title}>
        {title}
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
        <img
          className={styles.icon}
          onClick={toggleDescription}
          alt="Toggle description"
          src={cog}
        />
      </h1>
      <p className={styles.description}>{description}</p>
      {identifier && <div className={styles.beta}>{identifier}</div>}
    </div>
    {isDescriptionVisible && (
      <div className={styles.description}>{children}</div>
    )}
  </header>
)

export default DashboardSettingsHeader
