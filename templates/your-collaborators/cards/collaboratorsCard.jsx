import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'
import placeholder from '../../../components/upload/assets/uniHolder.svg'
import Actions from '../../../components/actions'
import texts from '../../../texts/deduplication/deduplication.yml'
import { Button } from '../../../design'

const CollaboratorsCard = ({ tag: Tag = 'td', className }) => (
  <Tag colSpan="12" className={classNames.use(styles.article).join(className)}>
    <>
      <div className={styles.header}>
        <div className={styles.innerWrapper}>
          <img className={styles.cardImg} src={placeholder} alt="kababMenu" />
          <h5 className={styles.cardTitle}>
            Manchester Metropolitan University
          </h5>
        </div>
        <Actions
          className={styles.actionItem}
          description={texts.info.info}
          hoverIcon={
            <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
          }
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.innerWrapper}>
          <span className={styles.results}>5 author</span>
          <span className={styles.results}>65 outputs</span>
        </div>
        <Button className={styles.button} variant="contained" tag="div">
          Review
        </Button>
      </div>
    </>
  </Tag>
)

export default CollaboratorsCard
