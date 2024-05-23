import { classNames } from '@oacore/design/lib/utils'
import React from 'react'

import styles from './styles.module.css'

const TextStat = ({
  counter,
  className,
  key,
  content,
  doiCount,
  totalDoiCount,
}) => {
  const doiCreated =
    content.id === 'doi' ? (doiCount / totalDoiCount) * 100 : ''

  return (
    <div
      key={key}
      className={classNames.use(styles.statusWrapper).join(className)}
    >
      <div className={className.statusTextTitle}>
        {counter} - {content.title}
      </div>

      <p>{doiCreated}</p>
    </div>
  )
}

export default TextStat
