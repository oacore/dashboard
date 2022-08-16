import { classNames } from '@oacore/design/lib/utils'
import React from 'react'
import { Button } from '@oacore/design/lib/elements'

import Markdown from '../markdown'
import styles from './styles.module.css'

const TextBox = ({
  className,
  onClick,
  description,
  buttonCaption,
  buttonUrl,
}) => (
  <div className={classNames.use(styles.box).join(className)}>
    <Markdown className={styles.boxText}>{description}</Markdown>
    <div className={styles.boxButton}>
      <Button
        variant="outlined"
        onClick={onClick || null}
        href={buttonUrl || null}
      >
        {buttonCaption}
      </Button>
    </div>
  </div>
)

export default TextBox
