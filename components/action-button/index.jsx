import React from 'react'

import styles from './styles.module.css'

import { Button } from 'design'

const ActionButton = ({ text, onClick, active }) => (
  <Button
    onClick={onClick}
    className={styles.button}
    variant={active ? 'contained' : 'outlined'}
  >
    {text}
  </Button>
)

export default ActionButton
