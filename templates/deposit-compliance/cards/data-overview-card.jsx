import React, { useContext } from 'react'

import styles from '../styles.module.css'
import checked from '../../../components/upload/assets/checkGreen.svg'
import { GlobalContext } from '../../../store'
import TextWithTooltip from '../../../components/textWithTooltip/textWithtooltip'

import { Card, Button } from 'design'
import * as texts from 'texts/depositing'
import { valueOrDefault } from 'utils/helpers'
import NumericValue from 'components/numeric-value'

const DataOverviewCard = ({ totalCount, complianceLevel }) => {
  const { ...globalStore } = useContext(GlobalContext)
  return (
    <Card className={styles.dataOverview} tag="section">
      <div className={styles.setHeaderWrapper}>
        <Card.Title tag="h2">{texts.dataOverview.title}</Card.Title>
        {globalStore?.setSelectedItem && (
          <div>
            <img src={checked} alt="" />
            <span className={styles.setName}>
              <TextWithTooltip
                className={styles.setName}
                text={globalStore.selectedSetName}
              />
            </span>
          </div>
        )}
      </div>
      <div className={styles.numbers}>
        <NumericValue
          tag="p"
          value={valueOrDefault(totalCount, 'Loading...')}
          caption="outputs counted"
          title={texts.dataOverview.tooltipOutputsCounted}
        />
        {totalCount > 0 && (
          <NumericValue
            tag="p"
            value={valueOrDefault(100 - complianceLevel, 'Loading...')}
            append="%"
            caption="non-compliant"
            title={texts.dataOverview.tooltipNonCompliant}
          />
        )}
      </div>
      <Button tag="a" href="#deposit-dates-card" variant="contained">
        {texts.dataOverview.redirect}
      </Button>
    </Card>
  )
}

export default DataOverviewCard
