import React, { useEffect, useState } from 'react'
import { Card } from '@oacore/design'
import { classNames } from '@oacore/design/lib/utils'

import { Button } from '../../../design'
import styles from '../styles.module.css'
import ReadySwTableComponent from './readySwTable'
import texts from '../../../texts/sw/sw.yml'

const SwTable = ({
  swTableDataLoading,
  tableSwData,
  initialLoad,
  setActiveButton,
  activeButton,
  localSearchTerm,
  fetchData,
  onSearchChange,
  hasError,
}) => {
  const [currentTab, setCurrentTab] = useState(activeButton)

  useEffect(() => {
    setCurrentTab(activeButton)
  }, [activeButton])

  const handleButtonClick = (action) => {
    setActiveButton(action)
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'ready':
        return (
          <ReadySwTableComponent
            localSearchTerm={localSearchTerm}
            fetchData={fetchData}
            onSearchChange={onSearchChange}
            initialLoad={initialLoad}
            data={tableSwData.groups?.ready_for_validation}
            isLoading={swTableDataLoading}
            totalLength={tableSwData.groups?.ready_for_validation.length}
            hasError={hasError}
            currentTab={currentTab}
          />
        )
      // case 'sent':
      //   return (
      //     <ReadySwTableComponent
      //       initialLoad={initialLoad}
      //       data={tableSwData.groups?.ready_for_validation}
      //       isLoading={swTableDataLoading}
      //       visibleMenu={visibleMenu}
      //       setVisibleMenu={setVisibleMenu}
      //       handleToggleRedirect={handleToggleRedirect}
      //       totalLength={globalStore.dataProvider.orcidStatData.basic}
      //       currentTab={currentTab}
      //     />
      //   )
      // case 'responded':
      //   return (
      //     <ReadySwTableComponent
      //       initialLoad={initialLoad}
      //       data={tableSwData.groups?.ready_for_validation}
      //       isLoading={swTableDataLoading}
      //       visibleMenu={visibleMenu}
      //       setVisibleMenu={setVisibleMenu}
      //       handleToggleRedirect={handleToggleRedirect}
      //       totalLength={globalStore.dataProvider.orcidStatData.basic}
      //       currentTab={currentTab}
      //     />
      //   )
      // case 'cancelled':
      //   return (
      //     <ReadySwTableComponent
      //       initialLoad={initialLoad}
      //       data={tableSwData.groups?.ready_for_validation}
      //       isLoading={swTableDataLoading}
      //       visibleMenu={visibleMenu}
      //       setVisibleMenu={setVisibleMenu}
      //       handleToggleRedirect={handleToggleRedirect}
      //       totalLength={globalStore.dataProvider.orcidStatData.basic}
      //       currentTab={currentTab}
      //     />
      //   )
      default:
        return null
    }
  }

  return (
    <Card className={styles.swTableWrapper}>
      <div className={styles.buttonGroup}>
        {Object.values(texts.table.actions).map((button, idx) => (
          <Button
            key={button.action}
            className={classNames.use(styles.actionButton, {
              [styles.activeButton]: activeButton === button.action,
              [styles.disabledButton]: idx !== 0,
            })}
            onClick={() => idx === 0 && handleButtonClick(button.action)}
            disabled={idx !== 0}
          >
            {button.name}
          </Button>
        ))}
      </div>
      <div className={styles.contentWrapper}>{renderContent()}</div>
    </Card>
  )
}

export default SwTable
