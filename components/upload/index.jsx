import React from 'react'
import { Button } from '@oacore/design'

import styles from './styles.module.css'

const Upload = ({ buttonCaptions, imgDefault, imageCaption }) => {
  const [preview, setPreview] = React.useState(imgDefault)
  const [imageFile, setImageFile] = React.useState(null)

  // Posibility check image dimensions
  // const imgElement = React.useRef(null)
  // const onImageLoad = () => {
  //   console.log(imgElement.current.naturalHeight)
  //   console.log(imgElement.current.naturalWidth)
  // }

  function uploadFile(file) {
    const reader = new FileReader()
    reader.readAsBinaryString(file)

    reader.onload = () => {
      const fileRes = btoa(reader.result)
      setPreview(`data:image/jpg;base64,${fileRes}`)
      setImageFile(file)
    }

    reader.onerror = () => {}
  }

  const handleUpload = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const [file] = e.target.files || e.dataTransfer.files
    uploadFile(file)
  }

  const onReset = () => {
    setPreview(imgDefault)
    setImageFile(null)
  }

  return (
    <div className={styles.upload}>
      {imageFile && (
        <span
          aria-hidden="true"
          variant="text"
          className={styles.delete}
          onClick={onReset}
        >
          {buttonCaptions.delete}
        </span>
      )}
      <div className={styles.container}>
        <img
          src={preview}
          alt="Logo"
          // ref={imgElement}
          className={styles.logo}
          // onLoad={onImageLoad}
        />
        {imageCaption && <span className={styles.caption}>{imageCaption}</span>}
        {imageFile ? (
          <Button type="submit" className={styles.action} variant="contained">
            {buttonCaptions.save}
          </Button>
        ) : (
          <>
            <input
              type="file"
              className={styles.input}
              accept="image/*"
              onChange={(e) => handleUpload(e)}
            />
            <Button className={styles.action} variant="contained">
              {buttonCaptions.upload}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Upload
