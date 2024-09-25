import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'

import { Card, ProgressSpinner } from '../../../design'
import styles from '../../rrs-policy/styles.module.css'
import texts from '../../../texts/rrs-retention/rrs.yml'
import Tablev2 from '../../../components/tablev2/tablev2'

const SdgTable = observer(() => {
  const [loading] = useState(false)
  return (
    <Card className={styles.rrsTableWrapper} id="rrsTable">
      <Card.Title tag="h2">{texts.table.title}</Card.Title>
      <div className={styles.itemCountIndicator}>{texts.table.subTitle}</div>
      {loading ? (
        <div className={styles.dataSpinnerWrapper}>
          <ProgressSpinner className={styles.spinner} />
          <p className={styles.spinnerText}>
            This may take a while, longer for larger repositories ...
          </p>
        </div>
      ) : (
        <>
          <Tablev2
            className={styles.rrsTable}
            isHeaderClickable
            rowIdentifier="articleId"
          >
            <div>ok</div>
          </Tablev2>
        </>
      )}
    </Card>
  )
})

export default SdgTable
