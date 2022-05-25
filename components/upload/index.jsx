import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import imagePlacegolder from './assets/placeholder.svg'

import { Button, Icon } from 'design'

const Upload = ({
  buttonCaptions,
  imageCaption,
  deleteCaption,
  logoUrl: initialLogo,
  onSubmit,
}) => {
  const fileRef = React.useRef()
  const [preview, setPreview] = React.useState()
  const [isUploadingActive, setIsUploadingActive] = React.useState(false)

  function uploadFile(file) {
    const reader = new FileReader()
    reader.readAsBinaryString(file)

    reader.onload = () => {
      const fileRes = btoa(reader.result)
      setPreview(`data:image/jpg;base64,${fileRes}`)
    }

    reader.onerror = () => {}
  }

  const handleUpload = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUploadingActive(true)
    const [file] = e.target.files || e.dataTransfer.files
    uploadFile(file)
  }

  const onReset = async () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(deleteCaption)) {
      await onSubmit({
        logoBase64: null,
      })
      setIsUploadingActive(false)
      setPreview(null)
    }
  }

  const handleSubmit = async () => {
    await onSubmit({
      logoBase64: preview,
    })
    setIsUploadingActive(false)
    setPreview(null)
  }

  const isActiveImage = !!preview || !!initialLogo

  const setActionsComponent = () => {
    if (preview) {
      return (
        <Button
          type="submit"
          className={styles.action}
          variant="outlined"
          onClick={handleSubmit}
        >
          {buttonCaptions.save}
        </Button>
      )
    }

    return (
      <>
        <Button
          className={styles.action}
          variant="contained"
          onClick={() => fileRef.current.click()}
        >
          {initialLogo && !preview
            ? buttonCaptions.change
            : buttonCaptions.upload}
        </Button>
        <input
          type="file"
          className={styles.input}
          accept="image/*"
          ref={fileRef}
          onChange={(e) => handleUpload(e)}
        />
      </>
    )
  }

  const actionComponent = setActionsComponent()

  return (
    <div className={styles.container}>
      <div
        className={classNames.use(styles.image, {
          [styles.imagePreview]: isActiveImage,
        })}
      >
        {isActiveImage && (
          <Button onClick={onReset} className={styles.delete}>
            <Icon src="#close" alt="delete" />
          </Button>
        )}
        <img
          src={isUploadingActive ? preview : initialLogo || imagePlacegolder}
          alt="Logo"
          className={classNames.use(styles.logo)}
        />
      </div>
      {imageCaption && <span className={styles.caption}>{imageCaption}</span>}
      {actionComponent}
    </div>
  )
}

export default Upload
