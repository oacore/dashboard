import React, { useCallback, useEffect, useState } from 'react'
import {
  DocumentationMembership,
  DocumentationMembershipNav,
  Video,
  DocumentSelect,
} from '@oacore/design/lib/modules'
import { useRouter } from 'next/router'

import styles from './styles.module.css'
import text from '../../texts/memership/membership.yml'
import Markdown from '../../components/markdown'

import videoIcon from 'components/upload/assets/tutorialActive.svg'
import videoGuide from 'components/upload/assets/videoGuide.svg'
import redirectIcon from 'components/upload/assets/redirectLink.svg'
// import DocumentSelect from '../../../components/docs-select'

function normalizeHref(str) {
  const test = str.replace('#', '')
  return test.replace('_', '-')
}

const DocumentationBlockTemplate = ({
  docs,
  navigation,
  headerDashboard,
  dataProviderDocs,
}) => {
  const [highlight, setHighlight] = useState()
  const [navActiveIndex, setNavActiveIndex] = useState(null)
  const [selectedOption, setSelectedOption] = useState(
    text.documentationSwitcher[1].title
  )
  const [showNavigator, setShowNavigator] = useState(false)
  const [visibleVideo, setVisibleVideo] = useState(null)

  const handleContentOpen = useCallback((condition) => {
    if (condition) setVisibleVideo(condition)
  }, [])

  const route = useRouter()
  const headerHeight = 56

  useEffect(() => {
    const { hash } = window.location
    const id = hash.substring(1)
    const element = document.getElementById(id)
    setTimeout(() => {
      if (element) {
        const rect = element.getBoundingClientRect()
        window.scrollTo({
          top: rect.top + window.scrollY - headerHeight,
          behavior: 'smooth',
          block: 'center',
        })
        const n = docs?.items?.findIndex((item) => item.id === id)
        setHighlight(n)
      }
    }, 100)
  }, [route.asPath])

  useEffect(() => {
    const id = route.query?.r
    if (id) {
      const n = navigation.navItems.findIndex(
        (item) => normalizeHref(item.href) === id
      )
      setNavActiveIndex(n)
    }
  }, [])

  const handleSelectChange = (option) => {
    setSelectedOption(option)
  }

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
    <div>
      {selectedOption === text.documentationSwitcher[0].title ? (
        <>
          <h2 className={styles.documentationHeader}>
            {dataProviderDocs.providersHeader.header.title}
          </h2>
          <Markdown>{dataProviderDocs.providersHeader.header.caption}</Markdown>
        </>
      ) : (
        <>
          <h2 className={styles.documentationHeader}>
            {headerDashboard.header.title}
          </h2>
          <Markdown>{headerDashboard.header.caption}</Markdown>
        </>
      )}
      <div className={styles.navWrapper}>
        <div className={styles.navTitle}>
          <span>CORE DOCUMENTATION:</span>
        </div>
        <div className={styles.selectWrapper}>
          <DocumentSelect
            list={[
              text.documentationSwitcher[0].title,
              text.documentationSwitcher[1].title,
            ]}
            handleSelect={handleSelectChange}
            selectedOption={selectedOption}
          />
        </div>
      </div>
      <div className={styles.docsLayout}>
        {selectedOption === text.documentationSwitcher[1].title ? (
          <DocumentationMembership
            docs={docs?.items}
            handleContentOpen={handleContentOpen}
            highlight={highlight}
            setHighlight={setHighlight}
            docsTitle={text.documentationSwitcher[1].title}
            mulltyDocs
            videoIcon={videoIcon}
            redirectLink={redirectIcon}
            showNavigator={showNavigator}
            handleScrollToTop={handleScrollToTop}
            nav={
              <DocumentationMembershipNav
                activeIndex={navActiveIndex}
                setNavActiveIndex={setNavActiveIndex}
                textData={navigation}
                setHighlight={setHighlight}
                mulltyDocs
              />
            }
          />
        ) : (
          <DocumentationMembership
            docs={dataProviderDocs.dataProviderDocs?.items}
            tutorial={dataProviderDocs.dataProviderDocs?.tutorial}
            highlight={highlight}
            setHighlight={setHighlight}
            imageSource
            docsTitle={text.documentationSwitcher[0].title}
            mulltyDocs
            tutorialIcon={videoGuide}
            showNavigator={showNavigator}
            handleScrollToTop={handleScrollToTop}
            handleContentOpen={handleContentOpen}
            nav={
              <DocumentationMembershipNav
                activeIndex={navActiveIndex}
                setNavActiveIndex={setNavActiveIndex}
                textData={dataProviderDocs.navigation}
                setHighlight={setHighlight}
                mulltyDocs
              />
            }
          />
        )}

        {visibleVideo && (
          <Video
            visibleModal={visibleVideo}
            closeModal={() => setVisibleVideo(false)}
            video={visibleVideo}
          />
        )}
      </div>
    </div>
  )
}

export default DocumentationBlockTemplate
