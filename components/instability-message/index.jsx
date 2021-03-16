import React from 'react'

import styles from './styles.module.css'

import { Icon, Message } from 'design'

const InstabilityMessage = () => (
  <Message className={styles.container}>
    <Icon src="#information-outline" /> Due to high usage, CORE is currently
    experiencing some instability. Our team is investigating and will implement
    a&nbsp;fix as soon as possible. We will continue providing updates here,
    please keep checking back. Apologies for any inconvenience.
  </Message>
)

export default InstabilityMessage
