import React, { useEffect, useState } from 'react'

import styles from '../styles.module.css'
import ShowMoreText from '../../../components/showMore'

const CompareCard = ({ worksDataInfo, outputsDataInfo }) => {
  const [modifiedWorksData, setModifiedWorksData] = useState([])
  const [modifiedOutputsData, setModifiedOutputsData] = useState([])

  const generatedTitle = [
    'author',
    'type',
    'Field of study',
    'DOI',
    'Publication date',
    'Deposited date',
    'Abstract',
  ]

  useEffect(() => {
    const generatedData = [
      worksDataInfo?.data?.authors?.map((author) => author.name).join(', '),
      worksDataInfo?.data?.documentType,
      worksDataInfo?.data?.fieldOfStudy,
      worksDataInfo?.data?.doi,
      worksDataInfo?.data?.publishedDate,
      worksDataInfo?.data?.depositedDate,
      worksDataInfo?.data?.abstract,
    ]
    setModifiedWorksData(generatedData)
  }, [worksDataInfo?.data])

  useEffect(() => {
    const generatedData = [
      outputsDataInfo?.data?.authors?.map((author) => author.name).join(', '),
      outputsDataInfo?.data?.documentType,
      outputsDataInfo?.data?.fieldOfStudy,
      outputsDataInfo?.data?.doi,
      outputsDataInfo?.data?.publishedDate,
      outputsDataInfo?.data?.depositedDate,
      outputsDataInfo?.data?.abstract,
    ]
    setModifiedOutputsData(generatedData)
  }, [outputsDataInfo?.data])

  return (
    <div className={styles.compareCardWrapperMain}>
      <div className={styles.compareCardWrapper}>
        <div className={styles.compareCardLeft}>
          <div className={styles.compareTitleWrapperLeft}>
            <span className={styles.compareTitle}>
              {worksDataInfo?.data?.title}
            </span>
          </div>
          <div className={styles.itemsWrapper}>
            <div className={styles.dataTitleWrapper}>
              {generatedTitle?.map((key) => (
                <div className={styles.dataTitle} key={key}>
                  {key}
                </div>
              ))}
            </div>
            <div className={styles.itemWrapper}>
              {modifiedWorksData?.map((value) => (
                <div key={value} className={styles.dataItem}>
                  <ShowMoreText text={value || 'N/A'} maxWords={30} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.compareCardRight}>
          <div className={styles.compareTitleWrapper}>
            <span className={styles.compareTitle}>
              {outputsDataInfo?.data?.title}
            </span>
          </div>
          {modifiedOutputsData?.map((value) => (
            <div key={value} className={styles.dataItem}>
              <ShowMoreText text={value || 'N/A'} maxWords={30} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompareCard
