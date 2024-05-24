import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import docs from '../upload/assets/docs.svg'
import styles from './styles.module.css'

const TextUSRN = ({ className, content }) => {
  const linkDocumentation =
    content.linkDocumentation && content.linkDocumentation.length > 3 ? (
      <div>
        <img
          className={classNames.use(styles.docsLink)}
          src={docs}
          alt="docs"
        />
        <a href={content.linkDocumentation} target="_blank" rel="noreferrer">
          Link to documentation
        </a>
      </div>
    ) : (
      ''
    )

  return (
    <div
      key={content.id}
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
