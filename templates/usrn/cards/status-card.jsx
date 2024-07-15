import React from 'react'

import styles from '../styles.module.css'
import TextUSRN from '../../../components/usrn-text'
import StatUSRN from '../../../components/usrn-stat'

import { Card, Button } from 'design'
import * as texts from 'texts/usrn'
import Markdown from 'components/markdown'

const StatusCard = ({ usrnParams }) => {
  let counterStat = 0
  const { usrnDateReportUpdate } = usrnParams
  return (
    <Card tag="section">
      <div className={styles.statusDateReportWrapper}>
        {usrnDateReportUpdate ? (
          <>
            <div className={styles.statusDateReportFirst}>
              {texts.status.dateReport}: {usrnDateReportUpdate}
            </div>
            <Button variant="outlined" className={styles.headerButton}>
              {texts.status.buttons.update}
            </Button>
          </>
        ) : (
          ''
        )}
        <Button variant="contained" className={styles.headerButton}>
          {texts.status.buttons.download}
        </Button>
      </div>
      <Card.Title className={styles.statusTitleFirst}>
        {texts.status.titleFirst}
      </Card.Title>
      <div className={styles.statusDescriptionFirst}>
        <Markdown>{texts.status.descriptionFirst}</Markdown>
      </div>
      <div className={styles.statusDateReportSecond}>
        {usrnDateReportUpdate}
      </div>
      {/* eslint-disable-next-line array-callback-return,consistent-return */}
      {Object.keys(texts.status.statusItems).map((key) => {
        if (texts.status.statusItems[key].isEnable === 'yes') {
          if (texts.status.statusItems[key].type === 'statistic') {
            // eslint-disable-next-line no-plusplus
            ++counterStat
            return (
              <StatUSRN
                counter={counterStat}
                content={texts.status.statusItems[key]}
                className={styles}
                usrnParams={usrnParams}
              />
            )
          }
          return (
            <TextUSRN
              content={texts.status.statusItems[key]}
              className={styles}
            />
          )
        }
      })}

      <div className={styles.statusLineSplitter} />
    </Card>
  )
}

export default StatusCard
