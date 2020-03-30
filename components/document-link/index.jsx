import React from 'react'

import styles from './styles.module.css'

import { Button, Icon } from 'design'

const DocumentLink = React.memo(({ href, children }) => (
  <Button
    tag="a"
    href={href}
    target="_blank"
    rel="noopener"
    variant="contained"
    className={styles.documentLink}
  >
    {children}
    <Icon src="#open-in-new" alt="open" aria-hidden />
  </Button>
))

export default DocumentLink
