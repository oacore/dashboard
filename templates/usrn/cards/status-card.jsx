import React from 'react'

import styles from '../styles.module.css'
import TextUSRN from '../../../components/usrn-text'
import StatUSRN from '../../../components/usrn-stat'

import { Card, Button } from 'design'
import * as texts from 'texts/usrn'
import Markdown from 'components/markdown'

const StatusCard = ({ usrnParams }) => {
  const { usrnDateReportUpdate } = usrnParams
  const handleDownloadPDF = () => {
    window.print()
  }
  return (
    <Card id="usrnReport" tag="section">
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
        <Button
          variant="contained"
          className={styles.headerButton}
          onClick={handleDownloadPDF}
        >
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
            return (
              <StatUSRN
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
