import React from 'react'
import { Card, Button, Link } from '@oacore/design'

import styles from './404.module.css'

const NotFoundPage = ({ ...passProps }) => (
  <Card {...passProps}>
    <h1>Uh-oh</h1>
    <p>The page you were looking for could not be found.</p>
    <p>To help you find what you are looking for, why not</p>
    <Button
      tag={Link}
      variant="contained"
      href="/"
      className={styles.homepageButton}
    >
      Go back to the homepage
    </Button>
    <Button
      tag={Link}
      variant="outlined"
      external
      href="https://core.ac.uk/about/#contact"
    >
      Contact us
    </Button>
  </Card>
)

export default NotFoundPage
