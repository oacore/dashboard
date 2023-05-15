import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication/deduplication.yml'
import ActionModal from './tableActionModal'
import tick from '../../../components/upload/assets/greenTick.svg'

const TableActions = ({
  updateWork,
  worksDataInfo,
  outputsDataInfo,
  selectedRowData,
}) => {
  const modalContent = texts.comparison.modalData
  const [currentModalData, setCurrentModalData] = useState()
  const [activeButton, setActiveButton] = useState()

  const handleModalOpen = (index) => {
    setCurrentModalData(modalContent[index])
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
  }

  const handleModalClose = () => {
    setCurrentModalData(null)
    document.body.classList.remove('modal-open')
    document.body.style.overflow = 'auto'
  }
  const handleModalConfirm = (modalData) => {
    handleModalClose()
    setActiveButton(modalData.type)
  }

  useEffect(() => {
    if (
      selectedRowData.type &&
      (selectedRowData.type === 'duplicate' ||
        selectedRowData.type === 'notSameArticle')
    )
      setActiveButton(selectedRowData.type)
    else setActiveButton('other')
  }, [selectedRowData])

  return (
    <>
      {currentModalData && (
        <div className={styles.overlay}>
          <ActionModal
            title={currentModalData.title}
            typeText={currentModalData.type}
            description={currentModalData.description}
            options={currentModalData.options}
            buttonConfirm={currentModalData.confirm}
            buttonCancel={currentModalData.cancel}
            onConfirm={() => handleModalConfirm(currentModalData)}
            onCancel={handleModalClose}
            updateWork={updateWork}
            worksDataInfo={worksDataInfo}
            outputsDataInfo={outputsDataInfo}
          />
        </div>
      )}
      <div className={styles.compareWrapper}>
        <div className={styles.buttonOptions}>
          {Object.values(texts.comparison?.buttons || []).map((item, index) => (
            // eslint-disable-next-line max-len
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <div
              className={classNames.use(styles.buttonOption, {
                [styles.clicked]: activeButton === item.type,
              })}
              onClick={() => handleModalOpen(index, item.title)}
              key={item.title}
            >
              {activeButton === item.type && <img src={tick} alt="tick" />}
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TableActions
