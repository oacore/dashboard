import React from 'react'
import { Popover } from '@oacore/design'
import classNames from '@oacore/design/lib/utils/class-names'

import styles from './styles.module.css'

const TextWithTooltip = ({ tag: Tag = 'div', className, text }) => (
  <Tag className={classNames.use(styles.container).join(className)}>
    <Popover className={styles.popover} placement="top" content={text}>
      <div title={text.length > 25 ? text : ''}>
        {text.length > 25 ? `${text.substring(0, 25)}..` : text}
      </div>
    </Popover>
  </Tag>
)

export default TextWithTooltip
