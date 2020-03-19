import React from 'react'

import styles from './styles.css'

import { Button } from 'design'

const TakeDown = React.memo(({ ...passProps }) => (
  <Button className={styles.takedown} variant="outlined" {...passProps}>
    Take down
  </Button>
))

export default TakeDown
