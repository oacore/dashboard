import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { useRouter } from 'next/router'

import menu from '../../components/upload/assets/menu.svg'
import styles from './styles.module.css'
import magnify from '../../public/design/icons/magnify.svg'
import DeduplicationInfoCard from './cards/deduplicationInfo'
import DeduplicationStatistics from './cards/deduplicationStatistics'
import DeduplicationTableCard from './tables/deduplicationTables'

import { deduplication } from 'texts/deduplication'

const DeduplicationPageTemplate = ({
  tag: Tag = 'main',
  className,
  deduplicationData,
  deduplicationInfo,
  outputsData,
  worksData,
  ...restProps
}) => {
  const router = useRouter()

  const [duplicateData, setDuplicateData] = useState({})
  const [duplicateDataDetails, setDuplicateDataDetails] = useState({})
  const [rowData, setRowData] = useState()

  const id = router.query['data-provider-id']

  useEffect(() => {
    async function fetchData() {
      const data = await deduplicationData(id)
      setDuplicateData(data)
    }
    fetchData()
  }, [id])

  // useEffect(() => {
  //   async function fetchData() {
  //     const data = await deduplicationData(id)
  //     setDuplicateDataDetails(data)
  //   }
  //   fetchData()
  // }, [id])

  const handeAdditionalInfo = async (row) => {
    const data = await deduplicationInfo(row.workId)
    setDuplicateDataDetails(data)
    setRowData(row)
  }

  const goBack = () => {
    setDuplicateDataDetails({})
  }

  return (
    <Tag
      className={classNames.use(styles.container).join(className)}
      {...restProps}
    >
      <header className={styles.header}>
        <div className={styles.validatorHeader}>
          {/* text */}
          <h1 className={styles.title}>{deduplication.deduplication.title}</h1>
          <div className={styles.iconWrapper}>
            <img className={styles.menu} src={magnify} alt="" />
            <img className={styles.menu} src={menu} alt="" />
          </div>
        </div>
        {/* text */}
        <p className={styles.description}>
          {deduplication.deduplication.description}
        </p>
      </header>
      <div className={styles.cardsWrapper}>
        <DeduplicationInfoCard />
        <DeduplicationStatistics />
      </div>
      <DeduplicationTableCard
        duplicateData={duplicateData}
        duplicateDataDetails={duplicateDataDetails}
        handeAdditionalInfo={handeAdditionalInfo}
        rowData={rowData}
        goBack={goBack}
        worksData={worksData}
        outputsData={outputsData}
      />
    </Tag>
  )
}
export default DeduplicationPageTemplate
