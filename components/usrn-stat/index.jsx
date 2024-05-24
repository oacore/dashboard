import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'

const TextStat = ({ counter, className, content, usrnParams }) => {
  const { doiCount, totalDoiCount } = usrnParams
  let statCreated = ''
  switch (content.id) {
    case 'doi':
      // statCreated = (doiCount / totalDoiCount) * 100
      statCreated = totalDoiCount
      statCreated = doiCount
      break
    default:
      statCreated = ''
  }

  return (
    <div
      key={content.id}
      className={classNames.use(styles.statusWrapper).join(className)}
    >
      <div className={className.statusTextTitle}>
        {counter} - {content.title}
      </div>

      <p>{statCreated}</p>
    </div>
  )
}

export default TextStat
