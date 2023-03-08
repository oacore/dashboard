import React from 'react'
import { Modal } from '@oacore/design'
import { Button } from '@oacore/design/lib/elements'

const ConfirmationDeleteInvite = ({ text, email, code, submitConfirm }) => {
  const [isModalActive, setModalActive] = React.useState(false)

  const handleUserRemove = () => {
    submitConfirm(code)
    setModalActive(false)
  }
  // const handleUserRemove = async (event) => {
  //   event.preventDefault()
  // const target = event.target.form || event.target
  // const formData = new FormData(target)
  // const data = Object.fromEntries(formData.entries())
  // const scope = target.getAttribute('name')
  //
  // const present = {
  //   'invite-control': delInviter,
  // }[scope]
  //
  // console.log(present)
  //
  // const result = await present(data)
  // setFormMessage({
  //   ...formMessage,
  //   [scope]: { type: result.type, text: result.message },
  // })
  // }

  const modal = isModalActive ? (
    <Modal aria-labelledby="modal-title-2" hideManually>
      <Modal.Title id="modal-title-2">{text.title}</Modal.Title>
      <Modal.Content tag="p">
        {text.content}
        <b>{email}</b>
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
