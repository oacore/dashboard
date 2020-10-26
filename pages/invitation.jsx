import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { withRouter } from 'next/router'

import styles from './invitation.module.css'

import Title from 'components/title'
import { Card } from 'design'
import { InvitationRegister } from 'components/forms'

const Invitation = ({ className, router, ...restProps }) => (
  <Card
    className={classNames.use(styles.invitationContainer, className).toString()}
    {...restProps}
  >
    <Title hidden>Register</Title>
    <InvitationRegister
      className={styles.card}
      tag="div"
      email={router.query.email}
      invitationCode={router.query.invitationCode}
    />
  </Card>
)

export default withRouter(Invitation)
