import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'

const TextUSRN = ({ className, key, content }) => {
  const linkDocumentation =
    content.linkDocumentation && content.linkDocumentation.length > 3 ? (
      <a href={content.linkDocumentation} target="_blank" rel="noreferrer">
        Link to documentation
      </a>
    ) : (
      ''
    )

  return (
    <div
      key={key}
      className={classNames.use(styles.statusWrapper).join(className)}
    >
      <div className={className.statusLineSplitter} />
      <div className={className.statusTextTitle}>{content.title}</div>
      <div className={className.statusTextDescription}>
        {content.description}
      </div>
      {linkDocumentation}
    </div>
  )
}

export default TextUSRN
