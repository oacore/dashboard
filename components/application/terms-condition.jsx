import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './terms-condition.module.css'
import texts from '../../texts/terms.yml'

import Markdown from 'components/markdown'
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
              Access and process data from your repository.
            </span>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div className={styles.termsToggler} onClick={renderTerms}>
              Read the full T&Cs document
            </div>
            {showMoreText ? <Markdown>{texts.terms}</Markdown> : ''}
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
