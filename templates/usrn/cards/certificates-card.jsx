import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './certificates.module.css'
import silver from '../../../components/upload/assets/certificate-silver.png'
import gold from '../../../components/upload/assets/certificate-gold.png'
import bronze from '../../../components/upload/assets/certificate-bronze.png'

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
                <img
                  className={styles.img}
                  src={
                    (textsFAIR.certificates.typeCertificates[key].id ===
                      'silver' &&
                      silver) ||
                    (textsFAIR.certificates.typeCertificates[key].id ===
                      'gold' &&
                      gold) ||
                    (textsFAIR.certificates.typeCertificates[key].id ===
                      'bronze' &&
                      bronze)
                  }
                  width="116"
                  alt={textsFAIR.certificates.typeCertificates[key].title}
                />
                <div className={styles.description}>
                  {textsFAIR.certificates.typeCertificates[key].description}
                </div>

                {isActiveCertificate && (
                  <div className={styles.accessText}>
                    {textsFAIR.certificates.typeCertificates[key].accessText}
                  </div>
                )}
                {!isActiveCertificate && (
                  <a href="/" className={styles.getCertificate}>
                    Get certification
                  </a>
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
