import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'
import LinkDoc from './linkDoc'
import LinkToolKit from './linkToolKit'

const TextUSRN = ({ className, content }) => (
  <div
    key={content.id}
    className={classNames.use(styles.statusWrapper).join(className)}
  >
    <div className={className.statusLineSplitter} />
    <div className={className.statusTextTitle}>{content.title}</div>
    <div className={className.statusTextDescription}>{content.description}</div>
    <LinkDoc content={content} />
    <LinkToolKit content={content} />
  </div>
)

export default TextUSRN
