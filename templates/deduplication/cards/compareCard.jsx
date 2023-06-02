import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button, Icon } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import ShowMoreText from '../../../components/showMore'
import info from '../../../components/upload/assets/info.svg'
import oai from '../../../components/upload/assets/oai.svg'
import { Message } from '../../../design'
import texts from '../../../texts/deduplication/deduplication.yml'

const CompareCard = ({ worksDataInfo, outputsDataInfo }) => {
  const [modifiedWorksData, setModifiedWorksData] = useState([])
  const [modifiedOutputsData, setModifiedOutputsData] = useState([])

  const generatedTitle = [
    'author',
    'type',
    'Field of study',
    'DOI',
    <img src={oai} alt="oai" />,
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
      worksDataInfo?.data?.oai,
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
      outputsDataInfo?.data?.oai,
      outputsDataInfo?.data?.publishedDate,
      outputsDataInfo?.data?.depositedDate,
      outputsDataInfo?.data?.abstract,
    ]
    setModifiedOutputsData(generatedData)
  }, [outputsDataInfo?.data])

  const handleWorksRedirect = (id) => {
    window.open(`https://core.ac.uk/works/${id}`, '_blank')
  }

  const handleOutputsRedirect = (id) => {
    window.open(`https://core.ac.uk/outputs/${id}`, '_blank')
  }

  return (
    <div className={styles.compareCardWrapper}>
      <div className={styles.compareCardLeft}>
        <Message className={styles.referenceTitleLeft}>
          <img className={styles.referenceIcon} src={info} alt="riox" />
          <p className={styles.referenceText}>
            {texts.comparison.referenceTitle}
          </p>
        </Message>
        <div className={styles.compareTitleWrapperLeft}>
          <div className={styles.compareTitle}>
            <ShowMoreText
              text={worksDataInfo?.data?.title || 'N/A'}
              maxLetters={120}
            />
          </div>
          <Button
            onClick={() => handleWorksRedirect(worksDataInfo?.data?.id)}
            className={styles.visibilityIconButton}
          >
            <Icon src="#eye" className={styles.visibility} />
            Live in CORE
          </Button>
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
            {modifiedWorksData?.map((value, index) => (
              <div
                key={value}
                className={classNames.use(styles.dataItem, {
                  [styles.height]: index === modifiedOutputsData.length - 1,
                })}
              >
                <ShowMoreText
                  text={value || 'N/A'}
                  maxLetters={
                    index === modifiedOutputsData.length - 1 ? 150 : 50
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.compareCardRight}>
        <Message className={styles.referenceTitle}>
          <img className={styles.referenceIcon} src={info} alt="riox" />
          <p className={styles.referenceText}>
            {`${texts.comparison.compareItem} ${outputsDataInfo?.data?.oai
              .split(':')
              .pop()}`}
          </p>
        </Message>
        <div className={styles.compareTitleWrapper}>
          <div className={styles.compareTitle}>
            <ShowMoreText
              text={outputsDataInfo?.data?.title || 'N/A'}
              maxLetters={120}
            />
          </div>
          <Button
            onClick={() => handleOutputsRedirect(worksDataInfo?.data?.id)}
            className={styles.visibilityIconButton}
          >
            <Icon src="#eye" className={styles.visibility} />
            Live in CORE
          </Button>
        </div>
        {modifiedOutputsData?.map((value, index) => (
          <div
            key={value}
            className={classNames.use(styles.dataItem, {
              [styles.height]: index === modifiedOutputsData.length - 1,
            })}
          >
            <ShowMoreText
              text={value || 'N/A'}
              maxLetters={index === modifiedOutputsData.length - 1 ? 150 : 50}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompareCard
