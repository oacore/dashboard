import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import placeholderImg from '../upload/assets/introMembership.svg'
import { Button } from '../../design'

const AccessPlaceholder = ({
  dataProviderData,
  screenHeight,
  description,
  customWidth,
}) => (
  <div
    className={classNames.use(styles.placeholderWrapper, {
      [styles.height]: screenHeight,
    })}
  >
    <img src={placeholderImg} alt="" />
    <div
      className={classNames.use(styles.placeholderText, {
        [styles.customWidth]: customWidth,
      })}
    >
      {description}
    </div>
    <Button
      className={styles.upgradeBtn}
      variant="contained"
      href={`/data-providers/${dataProviderData.id}/membership-type`}
    >
      Upgrade
    </Button>
  </div>
)

export default AccessPlaceholder
