import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import toolkit from '../upload/assets/toolkit.svg'
import styles from './styles.module.css'

const LinkToolKit = ({ content }) => {
  const linkToolKit =
    content.linkToolKit && content.linkToolKit.length > 3 ? (
      <a
        href={content.linkToolKit}
        target="_blank"
        rel="noreferrer"
        className={styles.toolkitLink}
      >
        <img
          className={classNames.use(styles.docsLink)}
          src={toolkit}
          alt="toolkit"
        />
        {content.textToolKit && content.textToolKit.length > 3 ? (
          content.textToolKit
        ) : (
          <span>Go to the toolkit</span>
        )}
      </a>
    ) : (
      ''
    )
  return <>{linkToolKit}</>
}

export default LinkToolKit
