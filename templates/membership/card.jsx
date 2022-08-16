import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Button } from '@oacore/design/lib/elements'

import styles from './styles.module.css'

import { patchValue } from 'utils/helpers'

const MembershipCard = ({
  title,
  textData,
  planName,
  isPlanActive,
  description,
  action,
}) => (
  <div
    key={title}
    className={classNames.use(styles.card, {
      [styles.cardActive]: planName === title.toLowerCase(),
    })}
  >
    <h1
      className={classNames.use(styles.cardTitle, {
        [styles.cardTitleActive]: isPlanActive,
      })}
    >
      {title}
      {isPlanActive && <span>{textData.plans.selected.header}</span>}
    </h1>
    <div
      className={classNames.use(styles.cardContent, {
        [styles.cardContentActive]: isPlanActive,
      })}
    >
      <p className={styles.cardDescription}>{description}</p>
      {isPlanActive ? (
        <p className={styles.planActive}>
          {patchValue(textData.plans.selected.card, {
            title,
          })}
        </p>
      ) : (
        action && (
          <Button
            href={action.url}
            variant="contained"
            className={styles.cardButton}
          >
            {action.caption}
          </Button>
        )
      )}
    </div>
  </div>
)

export default MembershipCard
