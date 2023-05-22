import React from 'react'
import { Button, Icon, Popover } from '@oacore/design'
import classNames from '@oacore/design/lib/utils/class-names'

import styles from './styles.module.css'
import questionInfo from '../upload/assets/questionInfo.svg'

const Actions = ({
  tag: Tag = 'div',
  className,
  downloadUrl,
  description,
  questionMark,
}) => (
  <Tag className={classNames.use(styles.container).join(className)}>
    {description && (
      <Popover className={styles.popover} placement="top" content={description}>
        <Button>
          {!questionMark ? (
            <Icon src="#alert-circle-outline" className={styles.pure} />
          ) : (
            <img src={questionInfo} alt="questionInfo" />
          )}
        </Button>
      </Popover>
    )}
    {downloadUrl && (
      <Button type="button" href={downloadUrl}>
        <Icon src="#download" className={styles.pure} />
      </Button>
    )}
  </Tag>
)

export default Actions
