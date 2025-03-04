import React, { useContext } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'
import { GlobalContext } from '../../../store'
import infoAction from '../../../components/upload/assets/infoAction.svg'

import Actions from 'components/actions'
import { Card } from 'design'

const OverviewCard = ({
  children,
  className,
  tooltip,
  title,
  downloadUrl,
  renderWarning,
  ...passProps
}) => {
  const { ...globalStore } = useContext(GlobalContext)
  return (
    <Card
      className={classNames.use(styles.overviewCard, className)}
      {...passProps}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderWrapper}>
          <Card.Title tag="h2">{title}</Card.Title>
          <div className={styles.actionWrapper}>
            {globalStore.dataProvider.id === 140 &&
              globalStore.selectedSetName &&
              renderWarning && (
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} src="#alert" />
                  <div>Repository wide</div>
                </div>
              )}
            <Actions
              downloadUrl={downloadUrl}
              description={tooltip}
              hoverIcon={
                <img src={infoAction} style={{ color: '#757575' }} alt="" />
              }
            />
          </div>
        </div>
      </div>
      {children}
    </Card>
  )
}

export default OverviewCard
