import React, { useState } from 'react'
import { Button } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import Markdown from '../../../components/markdown'

const ActionModal = ({
  title,
  description,
  options,
  onConfirm,
  onCancel,
  buttonConfirm,
  buttonCancel,
  updateWork,
  getDeduplicationInfo,
  worksDataInfo,
  typeText,
  itemId,
  duplicateData,
}) => {
  const [selectedOption, setSelectedOption] = useState('')

  function handleOptionChange(event) {
    setSelectedOption(event.target.value)
  }

  const handleConfirm = async (workId, outputId, type) => {
    const { duplicates } = duplicateData?.duplicateList[workId]
    const index = duplicates.findIndex((item) => item.documentId === outputId)

    if (index !== -1) duplicates[index].type = type

    if (selectedOption === '') onConfirm('')
    else onConfirm(selectedOption)

    await updateWork(workId, outputId, type)
    await getDeduplicationInfo(workId, outputId, type)
  }

  return (
    <div className={styles.modalWrapper}>
      <h2 className={styles.modalTitle}>{title}</h2>
      <Markdown className={styles.modalDescription}>{description}</Markdown>
      {options && (
        <div>
          {Object.values(options).map((option) => (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label className={styles.modalOption} key={option.title}>
              <input
                type="radio"
                name="option"
                value={option.type}
                checked={selectedOption === option.type}
                onChange={handleOptionChange}
                className={styles.modalOptionButton}
              />
              {option.title}
            </label>
          ))}
        </div>
      )}
      <div className={styles.buttonWrapper}>
        <Button
          variant="contained"
          onClick={() =>
            handleConfirm(
              worksDataInfo?.data?.id,
              itemId,
              selectedOption || typeText
            )
          }
        >
          {buttonConfirm}
        </Button>
        <Button onClick={onCancel}>{buttonCancel}</Button>
      </div>
    </div>
  )
}

export default ActionModal
