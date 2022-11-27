import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './terms-condition.module.css'

import { Button, Switch, useSwitch } from 'design'
import { withGlobalStore } from 'store'

const TermsConditionPopup = ({ store, ...passProps }) => {
  const { acceptedTCVersion } = passProps

  if (!acceptedTCVersion) return <></>

  const [isChecked, setIsChecked] = useSwitch(false)

  const toggleResolving = (e) => {
    setIsChecked(e)
  }

  const onClickDecline = () => {
    const data = {
      acceptedTCVersion: 0,
    }
    store.updateUser(data)
  }
  const onClickAccept = () => {
    const data = {
      acceptedTCVersion: isChecked ? 2 : 1,
    }
    store.updateUser(data)
  }

  const repositoryName = store?.dataProvider?.name ?? 'repository'
  return (
    <div className={styles.termsCondition}>
      <div className={styles.wrapper}>
        <div className={styles.popup}>
          <div className={styles.title}>
            Accept CORE&apos;s Terms & Conditions
          </div>
          <div className={styles.subTitle}>
            Please review and accept our T&Cs:
          </div>
          <div className={styles.termsText}>
            By accepting these T&Cs, <b>{repositoryName}</b> subscribes to the
            vision vision and declares its interest in participating in a global
            interoperable network of open repositories (and journal platforms)
            as envisioned by the Confederation of Open Access Repositories: “…
            the real power of Open Access lies in the possibility of connecting
            and tying repositories, which is why we need interoperability. In
            order to In order to create a seamless layer of content through
            connected repositories from around the world, Open Access relies on
            interoperability, the ability for systems to communicate with each
            other and pass information back and forth in a usable format.
            Interoperability allows us to exploit today’s computational power so
            that we can aggregate, data mine, create new tools and services, and
            and generate new knowledge from repository content.”
            https://www.coar-repositories.org/files/A-Case-for-Interoperability-Final-Version.pdf”
            <br />
            <br />
            “On behalf of <b>{repositoryName}</b>, I give CORE permission to
            harvest and use content from <b>{repositoryName}</b> in line with
            the principles of the Budapest Open Access Initiative definition of
            OA and the vision of the Confederation of Open Access Repositories
            (COAR) as detailed below:
            <br />
            <br />
            - “By “open access” to this literature, we mean its free
            availability on the public internet, permitting any users to read,
            download, copy, distribute, print, search, or link to the full texts
            of these articles, crawl them for indexing, pass them as data to
            software, or use them for any other lawful purpose, without
            financial, legal, or technical barriers other than those inseparable
            from gaining access to the internet itself. The only constraint on
            reproduction and distribution, and the only role for copyright in
            this domain, should be to give authors control over the integrity of
            their work and the right to be properly acknowledged and cited.”
            https://www.budapestopenaccessinitiative.org/read/
            <br />
            <br />- Recommendation Self-archiving (I) of the BOAI: “I.
            Self-Archiving: First, scholars need the tools and assistance to
            deposit their refereed journal articles in open electronic archives,
            a practice commonly called, self-archiving. When these archives
            conform to standards created by the Open Archives Initiative, then
            search engines and other tools can treat the separate archives as
            one. Users then need not know which archives exist or where they are
            located in order to find and make use of their contents.”
          </div>
          <Switch
            id="activated"
            variant="small"
            label="I agree to the Terms & Conditions"
            className={styles.termsCheckbox}
            onChange={toggleResolving}
            checked={isChecked}
          />
          <div className={styles.blockRight}>
            <Button
              className={classNames.use('button', styles.termsBtn).from(styles)}
              variant="outlined"
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
