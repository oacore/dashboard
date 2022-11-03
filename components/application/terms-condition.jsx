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
    // console.log('onClickDecline ')
  }
  const onClickAccept = () => {
    const data = {
      acceptedTCVersion: isChecked,
    }
    store.updateUser(data)
    // console.log('onClickAccept ')
  }

  const repositoryName = 'repository-name'
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
            By accepting these T&Cs, {repositoryName} subscribes to the vision
            and declares its interest in participating in a global interoperable
            network of open repositories (and journal platforms) as envisioned
            by the Confederation of Open Access Repositories: “… the real power
            of Open Access lies in the possibility of connecting and tying
            together repositories, which is why we need interoperability. In
            order to create a seamless layer of content through connected
            repositories from around the world, Open Access relies on
            interoperability, the ability for systems to communicate with each
            other and pass information back and forth in a usable format.
            Interoperability allows us to exploit today&apos;s computational
            power so that we can aggregate, data mine, create new tools and
            services, and generate new knowledge from repository content.”
            https://www.coar-repositories.org/files/A-Case-for-Interoperability-Final-Version.pdf
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
              Decline & Finish
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
