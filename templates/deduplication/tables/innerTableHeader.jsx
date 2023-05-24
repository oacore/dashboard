import { classNames } from '@oacore/design/lib/utils'
import React, { useState } from 'react'
import { Icon } from '@oacore/design/lib/elements'

import styles from '../styles.module.css'
import arrowLeft from '../../../components/upload/assets/ArrowLeft.svg'
import { Button } from '../../../design'
import texts from '../../../texts/deduplication/deduplication.yml'
import kababMenu from '../../../components/upload/assets/kebabMenu.svg'
import Menu from '../../../components/menu'

const InnerTableHeader = ({
  onClick,
  handleButtonToggle,
  compare,
  rowData,
}) => {
  const handleRedirect = (id) => {
    window.open(`https://core.ac.uk/works/${id}`, '_blank')
  }

  const [visibleMenu, setVisibleMenu] = useState(false)

  const handleClick = () => {
    setVisibleMenu(!visibleMenu)
  }

  const handleToggleRedirect = (key, worksId, oaiId) => {
    setVisibleMenu(false)
    if (key === 'coreUrl')
      window.open(`https://core.ac.uk/works/${worksId}`, '_blank')
    else window.open(`${process.env.IDP_URL}/oai/${oaiId}`, '_blank')
  }

  return (
    <>
      <div className={styles.moreHeaderWrapper}>
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div onClick={onClick} className={styles.backWrapper}>
          <img src={arrowLeft} alt="" />
          <div className={styles.goBack}>Back</div>
        </div>
        <Button
          onClick={handleButtonToggle}
          variant={compare ? 'contained' : 'outlined'}
        >
          {compare ? texts.moreInfo.action : texts.moreInfoComparison.action}
        </Button>
      </div>
      <div className={styles.compareItem}>
        <p className={classNames.use(styles.oaiItem)}>
          {rowData?.oai.split(':').pop()}
        </p>
        <p className={classNames.use(styles.columnItem)}>{rowData?.title}</p>
        <p className={classNames.use(styles.columnItem)}>
          {rowData?.authors.map((author) => author).join(' ')}
        </p>
        <p className={classNames.use(styles.dateItem)}>
          {rowData?.publicationDate}
        </p>
        <Icon
          onClick={() => handleRedirect(rowData.workId)}
          src="#eye"
          className={styles.visibleIcon}
        />
        <div className={styles.actionButtonWrapper}>
          <Button className={styles.actionButtonPure} onClick={handleClick}>
            <img src={kababMenu} alt="kababMenu" />
          </Button>
          <Menu
            visible={visibleMenu}
            className={styles.menuButton}
            stopPropagation
          >
            {Object.values(texts.actions).map(({ title, key }) => (
              <Menu.Item key={key} target="_blank">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div
                  onClick={() =>
                    handleToggleRedirect(key, rowData.workId, rowData.oai)
                  }
                >
                  {title}
                </div>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
    </>
  )
}

export default InnerTableHeader
