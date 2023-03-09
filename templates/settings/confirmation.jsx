import React from 'react'
import { Modal } from '@oacore/design'
import { Button } from '@oacore/design/lib/elements'

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
        {text.content}
        <b>{item.email}</b>
      </Modal.Content>
      <Modal.Footer>
        <Button onClick={() => handleUserRemove()} variant="contained">
          Yes
        </Button>{' '}
        <Button onClick={() => setModalActive(false)} variant="contained">
          No
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null

  return (
    <dev>
      <Button variant="contained" onClick={() => setModalActive(true)}>
        DELETE
      </Button>
      {modal}
    </dev>
  )
}

export default ConfirmationDeleteInvite
