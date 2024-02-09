import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'

import styles from '../styles.module.css'
import { Card } from '../../../design'
import texts from '../../../texts/rrs-retention/rrs.yml'
import RrsWarning from '../cards/warningCard'

const RrsTable = observer(() => {
  const [visibleHelp, setVisibleHelp] = useState(
    localStorage.getItem('rrsHelp') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('rrsHelp', visibleHelp)
  }, [visibleHelp])

  return (
    <Card>
      <Card.Title tag="h2">{texts.table.title}</Card.Title>
      <div className={styles.itemCountIndicator}>{texts.table.subTitle}</div>
      <RrsWarning
        show={texts.helpInfo.show}
        hide={texts.helpInfo.hide}
        description={texts.helpInfo.description}
        setText={setVisibleHelp}
        activeText={visibleHelp}
      />
    </Card>
  )
})

export default RrsTable
