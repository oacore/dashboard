import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

const Accordion = ({ tag: Tag = 'td', className, article, institution }) => {
  const makeBold = (item) => {
    const res = item.affiliation.name.filter((name) => {
      const split = name.split(',')
      return split.some(
        (n) => n.trim().toLowerCase() === institution.trim().toLowerCase()
      )
    })
    return res.length > 0
  }

  return (
    <Tag
      colSpan="12"
      className={classNames.use(styles.article).join(className)}
    >
      <>
        <div className={styles.articleHeader}>
          <h2>{article.title}</h2>
        </div>
        <div className={styles.wrapper}>
          <p className={styles.boxProp}>Authors</p>
          <div className={styles.box}>
            {article.affiliation_info.map((item) => (
              <div className={styles.accordionItemWrapper}>
                <p
                  className={classNames.use(styles.text, {
                    [styles.textBold]: makeBold(item),
                  })}
                >
                  {item.author_name}
                </p>
                {item.affiliation.name.some((name) => name.trim() !== '') && (
                  <a
                    className={styles.afiliation}
                    href={`https://ror.org/${item.affiliation.ror_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >{`(${item.affiliation.name})`}</a>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.wrapper}>
          <p className={styles.boxProp}>Publisher</p>
          <div className={styles.box}>
            {article.affiliation_info.map((item) => (
              <div className={styles.accordionItemWrapper}>
                <p className={styles.text}>{item.publisher}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    </Tag>
  )
}

export default Accordion
