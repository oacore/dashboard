import React, { useRef } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'

import { Card } from '../../design'
import styles from '../settings/styles.module.css'
import { useScrollEffect } from '../../pages/_app/hooks'

const BadgesPageTemplate = observer(
  ({ className, stateData, init, tag: Tag = 'main', ...restProps }) => {
    const router = useRouter()

    const uploadRef = useRef(null)
    const mappingRef = useRef(null)
    const inviteRef = useRef(null)

    const scrollTarget = {
      upload: uploadRef,
      mapping: mappingRef,
      invite: inviteRef,
    }

    const badgesData = stateData.docs?.items?.slice(-1)[0]

    useScrollEffect(scrollTarget[router.query.referrer])

    return (
      <Tag
        className={classNames.use(styles.container, className)}
        {...restProps}
      >
        {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
        <h1 className={styles.settingCardTitle} />
        <Card
          className={classNames.use(styles.section).join(className)}
          tag="section"
        >
          <Card.Title tag="h2">{badgesData.title}</Card.Title>
          <div className={styles.badgeContainer}>
            <Card.Description className={styles.badgeDescription} tag="div">
              <p>{badgesData.descriptionDashboard}</p>
              <div>
                {badgesData.images?.map((img) => (
                  <div className={styles.badgeWrapper}>
                    <div className={styles.imgWrapper}>
                      {/* eslint-disable-next-line max-len */}
                      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                      <img
                        key={img.file}
                        className={classNames.use(styles.image, {
                          [styles.badgeImage]: img.source,
                          [styles.badgeImageHeight]:
                            img.source?.includes('square'),
                        })}
                        src={img.file}
                        alt="image"
                      />
                    </div>
                    <div className={styles.textAlignment}>
                      <span className={styles.text}>{img.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Description>
          </div>
        </Card>
      </Tag>
    )
  }
)

export default BadgesPageTemplate
