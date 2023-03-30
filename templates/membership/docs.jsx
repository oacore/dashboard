import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './docs-styles.module.css'
import DocumentationNav from '../membershipDocumentationNav'
import Markdown from '../../components/markdown'

const DocumentationBlockTemplate = ({ headerDashboard, docs }) => {
  const [highlight, setHighlight] = useState()
  return (
    <div className={styles.documentationWrapper}>
      <h2 className={styles.documentationHeader}>
        {headerDashboard.header.title}
      </h2>
      <Markdown>{headerDashboard.header.caption}</Markdown>
      <div className={styles.placement}>
        <DocumentationNav setHighlight={setHighlight} />
        <div className={styles.documentationInnerWrapper}>
          {docs.items.map((item, index) => (
            <div
              key={item.id}
              className={styles.documentationItem}
              id={item.id}
            >
              <h3
                // className={styles.documentationItemTitle}
                className={classNames.use(styles.documentationItemTitle, {
                  [styles.highlighted]: highlight === index,
                })}
              >
                {item.title}
              </h3>
              <div className={styles.typeWrapper}>
                {item.membership.map((member) => (
                  <span
                    key={member.name}
                    className={classNames
                      .use(styles.membership)
                      .join(member.status ? styles.enabled : styles.disabled)}
                  >
                    {member.name}
                  </span>
                ))}
              </div>
              <Markdown>{item.descriptionDashboard}</Markdown>
              <div>
                {item?.images?.map((img) => (
                  <div className={styles.cardWrapper}>
                    <div
                      className={classNames.use({
                        [styles.imgWrapper]: img.source,
                      })}
                    >
                      {/* eslint-disable-next-line max-len */}
                      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                      <img
                        key={img.file}
                        className={classNames.use(styles.image, {
                          [styles.logoBanner]: item.id === 'logo-banner',
                          [styles.logoPersonalised]:
                            item.id === 'personalised-banner',
                          [styles.badgeImage]: img.source,
                          [styles.badgeImageHeight]:
                            img.source?.includes('square'),
                        })}
                        src={img.file}
                        alt="image"
                      />
                    </div>
                    {img.source && (
                      <div className={styles.textAlignment}>
                        <span className={styles.text}>{img.source}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentationBlockTemplate
