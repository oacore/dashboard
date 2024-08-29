import React, { useEffect, useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './docs-styles.module.css'
import DocumentationNav from '../membershipDocumentationNav'
import Markdown from '../../components/markdown'
import redirectLink from '../../components/upload/assets/redirectLink.svg'
import activeArrow from '../../components/upload/assets/activeArrow.svg'

const DocumentationBlockTemplate = ({ headerDashboard, docs, navigation }) => {
  const [highlight, setHighlight] = useState()
  const [showNavigator, setShowNavigator] = useState(false)

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setShowNavigator(true)
      else setShowNavigator(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={styles.documentationWrapper}>
      <h2 className={styles.documentationHeader}>
        {headerDashboard.header.title}
      </h2>
      <Markdown>{headerDashboard.header.caption}</Markdown>
      <div className={styles.placement}>
        <DocumentationNav navigation={navigation} setHighlight={setHighlight} />
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
              <div className={styles.subTitleWrapper}>
                <div className={styles.typeWrapper}>
                  {item?.membership?.map((member) => (
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
                {item.redirect && (
                  <a
                    target="_blank"
                    href={item.redirect?.link}
                    className={styles.linkWrapper}
                    rel="noreferrer"
                  >
                    <span className={styles.linkText}>
                      {item.redirect?.text}
                    </span>
                    <img alt="redirect" src={redirectLink} />
                  </a>
                )}
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
        {showNavigator && (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div className={styles.navigator} onClick={handleScrollToTop}>
            <img
              src={activeArrow}
              alt="Logo"
              className={styles.navigatorLogo}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentationBlockTemplate
