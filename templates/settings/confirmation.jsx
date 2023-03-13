import React from 'react'
import { Icon, Modal } from '@oacore/design'
import { Button } from '@oacore/design/lib/elements'

import { patchValue } from '../../utils/helpers'
import styles from './styles.module.css'

import Markdown from 'components/markdown'

const ConfirmationDeleteInvite = ({ text, item, submitConfirm }) => {
  const [isModalActive, setModalActive] = React.useState(false)

  const handleUserRemove = () => {
    submitConfirm(item)
    setModalActive(false)
  }

  const modal = isModalActive ? (
    <Modal aria-labelledby="modal-title-2" hideManually>
      <Modal.Title id="modal-title-2">{text.title}</Modal.Title>
      <Modal.Content tag="p">
        <Markdown className={styles.confirmationPopup}>
          {patchValue(text.content, { email: item.email })}
        </Markdown>
      </Modal.Content>
      <Modal.Footer className={styles.footer}>
        <Button onClick={() => handleUserRemove()} variant="contained">
          Yes
        </Button>
        <Button onClick={() => setModalActive(false)} variant="outlined ">
          No
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null

  return (
    <dev>
      <Icon
        src="#bin"
        className={styles.btnDelete}
        onClick={() => setModalActive(true)}
      />
      {modal}
    </dev>
  )
}

export default ConfirmationDeleteInvite
