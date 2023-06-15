import React from 'react'
import { Button } from '@oacore/design/lib/elements'
import { Modal } from '@oacore/design'

import styles from '../styles.module.css'
import compareGuide from '../../../components/upload/assets/compareGuide.svg'
import texts from '../../../texts/deduplication/deduplication.yml'
import Markdown from '../../../components/markdown'

const GuideCard = ({ onClose }) => (
  <Modal hideManually className={styles.guideModal}>
    <div>
      <h4 className={styles.guideHeader}>{texts.guideCard.title}</h4>
      <img
        className={styles.guideImage}
        src={compareGuide}
        alt="compareGuide"
      />
      <Markdown className={styles.guideText}>
        {texts.guideCard.description}
      </Markdown>
      <div className={styles.guideCardButtonWrapper}>
        <Button
          onClick={() => onClose()}
          variant="contained"
          className={styles.guideCardButton}
        >
          {texts.guideCard.action}
        </Button>
      </div>
    </div>
  </Modal>
)

export default GuideCard
