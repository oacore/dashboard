import React from 'react'
// import { Button } from '@oacore/design/lib/elements'
// import yaml from 'js-yaml'

import styles from '../styles.module.css'
import texts from '../../../texts/deduplication'
// import ActionModal from './tableActionModal'

const TableActions = () => (
  // const [currentModalData, setCurrentModalData] = useState(null)

  // const modalData = yaml.load(texts.deduplication.comparison.modalData)
  //
  // const handleModalOpen = (index) => {
  //   setCurrentModalData(modalData[index])
  // }
  //
  // const handleModalClose = () => {
  //   setCurrentModalData(null)
  // }
  //
  // const handleModalConfirm = () => {
  //   // handle modal confirm action
  //   handleModalClose()
  // }

  <div className={styles.compareWrapper}>
    <div className={styles.buttonOptions}>
      {/* eslint-disable-next-line import/no-named-as-default-member */}
      {Object.values(texts.deduplication.comparison?.buttons || []).map(
        (item) => (
          <div
            className={styles.buttonOption}
            // onClick={() => handleModalOpen(index)}
            key={item.title}
          >
            {item.title}
          </div>
        )
      )}
    </div>
    {/* {currentModalData && ( */}
    {/*  <ActionModal */}
    {/*    title={currentModalData.title} */}
    {/*    description={currentModalData.description} */}
    {/*    options={currentModalData.options} */}
    {/*    onConfirm={handleModalConfirm} */}
    {/*    onCancel={handleModalClose} */}
    {/*  /> */}
    {/* )} */}
  </div>
)

export default TableActions
