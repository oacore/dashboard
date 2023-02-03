import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './terms-condition.module.css'

import { Button } from 'design'
import { withGlobalStore } from 'store'

const TermsConditionPopup = ({ store, ...passProps }) => {
  const { acceptedTCVersion } = passProps
  const [tcVersion, setTcVersion] = useState(acceptedTCVersion > 0)
  const [showMoreText, setShowMoreText] = useState(false)

  const onClickDecline = () => {
    const data = {
      acceptedTCVersion: -1,
    }
    store.updateUser(data)

    const redirectUrl =
      typeof window != 'undefined'
        ? `${window.location.origin}/login?reason=logout`
        : null
    window.location = new URL(
      `./logout?continue=${redirectUrl}`,
      process.env.IDP_URL
    )
  }

  const onClickAccept = () => {
    const data = {
      acceptedTCVersion: 1,
    }
    store.updateUser(data)
    setTcVersion(true)
  }

  const renderTerms = () => {
    setShowMoreText(!showMoreText)
  }

  if (tcVersion) return <></>
  const repositoryName = store?.dataProvider?.name ?? 'repository'
  return (
    <div className={styles.termsCondition}>
      <div className={styles.wrapper}>
        <div
          className={classNames.use(styles.popup, {
            [styles.popupCenter]: !showMoreText,
          })}
        >
          <div className={styles.title}>
            Accept CORE&apos;s Terms & Conditions
          </div>
          <div
            className={classNames.use(styles.termsText, {
              [styles.termsTextHeight]: showMoreText,
            })}
          >
            <div className={styles.subTitle}>
              CORE needs from <b>{repositoryName}</b> permission to:
            </div>
            <span className={styles.subText}>
              Access and process data from your repository in line with the BOAI
              definition of OA.
            </span>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div className={styles.termsToggler} onClick={renderTerms}>
              Read the full T&Cs document
            </div>
            {showMoreText ? (
              <div>
                By accepting these T&Cs, <b>{repositoryName}</b> subscribes to
                the vision and declares its interest in participating in a
                global interoperable network of open repositories (and journal
                platforms) as envisioned by the Confederation of Open Access
                Repositories: “… the real power of Open Access lies in the
                possibility of connecting and tying together repositories, which
                is why we need interoperability. In order to create a seamless
                layer of content through connected repositories from around the
                world, Open Access relies on interoperability, the ability for
                systems to communicate with each other and pass information back
                and forth in a usable format. Interoperability allows us to
                exploit today&apos;s computational power so that we can
                aggregate, data mine, create new tools and services, and
                generate new knowledge from repository content.”
                https://www.coar-repositories.org/files/A-Case-for-Interoperability-Final-Version.pdf”
                <br />
                <br />
                <b>{repositoryName}</b> gives CORE permission to harvest and use
                content from <b>{repositoryName}</b> in line with the principles
                of the Budapest Open Access Initiative definition of OA and the
                vision of the Confederation of Open Access Repositories (COAR)
                as detailed below:
                <br />
                <br />
                “By “open access” to this literature, we mean its free
                availability on the public internet, permitting any users to
                read, download, copy, distribute, print, search, or link to the
                full texts of these articles, crawl them for indexing, pass them
                as data to software, or use them for any other lawful purpose,
                without financial, legal, or technical barriers other than those
                inseparable from gaining access to the internet itself. The only
                constraint on reproduction and distribution, and the only role
                for copyright in this domain, should be to give authors control
                over the integrity of their work and the right to be properly
                acknowledged and cited.”
                https://www.budapestopenaccessinitiative.org/read/
                <br />
                <br />
                Recommendation Self-archiving (I) of the BOAI: “I.
                Self-Archiving: First, scholars need the tools and assistance to
                deposit their refereed journal articles in open electronic
                archives, a practice commonly called, self-archiving. When these
                archives conform to standards created by the Open Archives
                Initiative, then search engines and other tools can treat the
                separate archives as one. Users then need not know which
                archives exist or where they are located in order to find and
                make use of their contents.”
              </div>
            ) : (
              ''
            )}
          </div>
          <div className={styles.blockRight}>
            <Button
              className={classNames.use('button', styles.termsBtn).from(styles)}
              tag="div"
              onClick={onClickDecline}
            >
              Decline & Exit
            </Button>
            <Button
              className={classNames.use('button', styles.termsBtn).from(styles)}
              variant="contained"
              tag="div"
              onClick={onClickAccept}
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default withGlobalStore(TermsConditionPopup)
