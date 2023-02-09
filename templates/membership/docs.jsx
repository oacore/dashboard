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
                    className={classNames
                      .use(styles.membership)
                      .join(member.status ? styles.enabled : styles.disabled)}
                  >
                    {member.name}
                  </span>
                ))}
              </div>
              <Markdown>{item.descriptionDashboard}</Markdown>
              {item?.images?.map((img) => (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  className={classNames.use(styles.image, {
                    [styles.logoBanner]: item.id === 'logo-banner',
                    [styles.logoPersonalised]:
                      item.id === 'personalised-banner',
                  })}
                  src={img.file}
                  alt="image"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DocumentationBlockTemplate
