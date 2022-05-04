import React from 'react'
import { Button, Icon } from '@oacore/design/lib/elements'
import classNames from '@oacore/design/lib/utils/class-names'

import styles from './styles.module.css'

const Actions = ({ tag: Tag = 'div', className, downloadUrl, text }) => (
  <Tag className={classNames.use(styles.container).join(className)}>
    {text && (
      <Button>
        <Icon src="#alert-circle-outline" className={styles.pure} />
      </Button>
    )}
    {downloadUrl && (
      <Button type="button" href={downloadUrl}>
        <Icon src="#download" className={styles.pure} />
      </Button>
    )}
  </Tag>
)

export default Actions
