import React from 'react'
import { withRouter } from 'next/router'

import styles from './styles.module.css'

import { ChangePassword } from 'components/forms'

const CreatePassword = ({ router }) => (
  <ChangePassword
    tag="div"
    className={styles.resetContainer}
    email={router.query.email}
    token={router.query.token}
  />
)

export default withRouter(CreatePassword)
