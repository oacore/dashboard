import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './certificates.module.css'

import { Card } from 'design'
import * as textsFAIR from 'texts/fair'

const CertificatesCard = () => (
  <Card tag="section">
    <div className={styles.cardsWrapper}>
      {Object.keys(textsFAIR.certificates.typeCertificates).map((key) => {
        if (textsFAIR.certificates.typeCertificates[key].isEnable === 'yes') {
          const isActiveCertificate =
            textsFAIR.certificates.typeCertificates[key].id === 'bronze'
          const dateCertified = '16.08.2024'
          return (
            <div
              className={classNames.use(styles.card, {
                [styles.certificateActive]: isActiveCertificate,
                [styles.certificateNotActive]: !isActiveCertificate,
              })}
            >
              <div className={styles.title}>
                {textsFAIR.certificates.typeCertificates[key].title}
                {isActiveCertificate && dateCertified && (
                  <div className={styles.certified}>
                    Certified {dateCertified}
                  </div>
                )}
              </div>
              <div className={styles.descriptionWrapper}>
                {textsFAIR.certificates.typeCertificates[key].img && (
                  <img
                    className={styles.img}
                    src={textsFAIR.certificates.typeCertificates[key].img}
                    width="110px"
                    height="110px"
                    alt={textsFAIR.certificates.typeCertificates[key].title}
                  />
                )}
                <div className={styles.description}>
                  {textsFAIR.certificates.typeCertificates[key].description}
                </div>

                {isActiveCertificate && (
                  <div className={styles.accessText}>
                    {textsFAIR.certificates.typeCertificates[key].accessText}
                  </div>
                )}
                {!isActiveCertificate && (
                  <div className={styles.getCertificateBtn}>
                    Get certification
                  </div>
                )}
              </div>
            </div>
          )
        }
        return ''
      })}
    </div>
  </Card>
)

export default CertificatesCard
