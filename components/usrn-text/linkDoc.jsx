import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import docs from '../upload/assets/docs.svg'
import styles from './styles.module.css'

const LinkDoc = ({ content }) => {
  const linkDocumentation =
    content.linkDocumentation && content.linkDocumentation.length > 3 ? (
      <div>
        <img
          className={classNames.use(styles.docsLink)}
          src={docs}
          alt="docs"
        />
        <a href={content.linkDocumentation} target="_blank" rel="noreferrer">
          {content.textLinkDoc ?? 'Link to documentation'}
        </a>
      </div>
    ) : (
      ''
    )
  return <>{linkDocumentation}</>
}

export default LinkDoc
