import React from 'react'
import { Button, Modal } from '@oacore/design'

import styles from './styles.module.css'

import TermsPage from 'pages/terms'
import { withGlobalStore } from 'store'

const TermsModal = ({ store, children }) => (
  <>
    {children}
    {!store.user.superAdmin &&
      store.dataProvider.policies !== null &&
      !store.dataProvider.areTermsAccepted && (
        <Modal
          aria-label="Terms and Conditions"
          hideManually
          className={styles.modal}
        >
          <Modal.Content className={styles.content}>
            <TermsPage />
          </Modal.Content>
          <Modal.Footer className={styles.footer}>
            <span className={styles.nameText}>
              Agreeing as {store.user.email}
            </span>
            <Button
              disabled={store.dataProvider.revalidatingPolicies}
              variant="contained"
              onClick={() => {
                store.dataProvider.acceptTerms()
              }}
            >
              Accept and continue
            </Button>
          </Modal.Footer>
        </Modal>
      )}
  </>
)
export default withGlobalStore(TermsModal)
