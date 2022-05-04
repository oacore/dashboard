import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const Numeral = React.memo(
  ({ children, className, size, tag: Tag = 'div', ...restProps }) => (
    <Tag
      className={classNames.use(styles.container, styles[size]).join(className)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const Appendix = React.memo(
  ({ children, className, bold, tag: Tag = 'span', ...restProps }) => (
    <Tag
      className={classNames
        .use(styles.appendix, {
          [styles.bold]: bold,
        })
        .join(className)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const Caption = React.memo(
  ({ children, className, tag: Tag = 'span', ...restProps }) => (
    <Tag
      className={classNames.use(styles.caption).join(className)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const Title = React.memo(
  ({ children, className, tag: Tag = 'span', ...restProps }) => (
    <Tag
      className={classNames.use(styles.title).join(className)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

const Diff = React.memo(
  ({ children, className, tag: Tag = 'span', ...restProps }) => (
    <Tag className={classNames.use(styles.diff).join(className)} {...restProps}>
      {children}
    </Tag>
  )
)

const Value = React.memo(
  ({ children, className, bold = false, tag: Tag = 'span', ...restProps }) => (
    <Tag
      className={classNames
        .use(styles.value, {
          [styles.bold]: bold,
        })
        .join(className)}
      {...restProps}
    >
      {children}
    </Tag>
  )
)

Numeral.Appendix = Appendix
Numeral.Caption = Caption
Numeral.Diff = Diff
Numeral.Value = Value
Numeral.Title = Title
export default Numeral
export { Appendix, Diff, Caption, Value, Title }
