import React, { useMemo } from 'react'

import styles from './styles.module.css'

import { Card } from 'design'

const IframeForm = ({ id, className, title, src, ...passProps }) => {
  const iframeSrc = useMemo(() => {
    const unknownOrigin = 'https://unknown.origin'
    const url = new URL(src, unknownOrigin)
    const params = new URLSearchParams(url.searchParams)
    params.set('elementId', id)

    if (url.origin === unknownOrigin)
      return `${url.pathname}?${params.toString()}`

    return `${url.href}?${params.toString()}`
  }, [src, id])

  return (
    <Card className={className}>
      <iframe
        id={id}
        className={styles.iframeForm}
        title={title}
        src={iframeSrc}
        {...passProps}
      />
      <div className={styles.ruleWrapper}>
        <a
          href="https://core.ac.uk/accessibility"
          target="_blank"
          className={styles.rule}
          rel="noreferrer"
        >
          Accessibility
        </a>
        <a
          href="https://core.ac.uk/privacy"
          target="_blank"
          className={styles.rule}
          rel="noreferrer"
        >
          Privacy
        </a>
      </div>
    </Card>
  )
}

export default IframeForm
