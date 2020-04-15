import React from 'react'

import styles from './styles.css'

import { Button, Icon } from 'design'

const TakeDown = React.memo(({ disabled, ...passProps }) => (
  <Button className={styles.takedown} variant="outlined" {...passProps}>
    {!disabled ? (
      'Take down'
    ) : (
      <>
        <Icon className={styles.icon} src="#earth" aria-hidden />
        Restore
      </>
    )}
  </Button>
))

export default TakeDown
