import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

const Accordion = ({ tag: Tag = 'td', className, article }) => (
  <Tag colSpan="12" className={classNames.use(styles.article).join(className)}>
    <>
      <div className={styles.articleHeader}>
        <h2>{article.DOI}</h2>
      </div>
      <div className={styles.wrapper}>
        <p className={styles.boxProp}>Authors</p>
        <div className={styles.box}>
          {article.affiliation_info.map((item) => (
            <div>
              <p className={styles.text}>{item.author_name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  </Tag>
)

export default Accordion
