import React from 'react'
import { withRouter } from 'next/router'

import styles from './styles.module.css'

import Title from 'components/title'
import { ChangePassword } from 'components/forms'

const CreatePassword = ({ router }) => (
  <>
    <Title hidden>Password reset</Title>
    <ChangePassword
      tag="div"
      className={styles.resetContainer}
      email={router.query.email}
      token={router.query.token}
    />
  </>
)

export default withRouter(CreatePassword)
