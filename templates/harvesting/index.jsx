import React, { useContext } from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { observer } from 'mobx-react-lite'

import styles from './styles.module.css'
import HarvestingStatusCard from './cards/harvesting-status-card'
import TypesList from './cards/types-list'
import useTypes from './hooks/use-types'
import HarvestingProgressCard from './cards/harvesting-progress'
import { GlobalContext } from '../../store'
import info from '../../components/upload/assets/infoLight.svg'

import Title from 'components/title'
import { Card, Button } from 'design'
import texts from 'texts/issues'

const HarvestingPageTemplate = observer(
  ({
    tag: Tag = 'main',
    className,
    harvestingStatus,
    issuesByType,
    aggregation,
    date,
    errorsCount,
    warningCount,
    metadataCount,
    fullTextCount,
    total,
    downloadResults,
    sendHarvestingRequest,
    issues,
    typesCount,
    responseData,
    ...restProps
  }) => {
    const { ...globalStore } = useContext(GlobalContext)

    const defaultType = texts.actions.find(
      (action) => action.defaultActive
    ).action

    const { issueList, onChangeIssueList, activeType } = useTypes(
      aggregation,
      defaultType
    )

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
        {...restProps}
      >
        <Title hidden>{texts.title}</Title>
        {globalStore.dataProvider.id === 140 &&
          globalStore?.setSelectedItem && (
            <div className={styles.infoWrapper}>
              <img className={styles.showIcon} src={info} alt="description" />{' '}
              {texts.setMessage.title}
            </div>
          )}
        <div className={styles.harvestingWrapper}>
          <HarvestingStatusCard
            metadataCount={metadataCount}
            lastHarvestingDate={harvestingStatus?.lastHarvestingDate || 0}
            fullTextCount={fullTextCount}
            errorsCount={typesCount}
            total={total}
          />
          <HarvestingProgressCard
            harvestingStatus={harvestingStatus}
            sendHarvestingRequest={sendHarvestingRequest}
            responseData={responseData}
          />
        </div>
        <Card className={styles.issuesCard}>
          <div className={styles.issuesCardHeader}>
            <Card.Title className={styles.issuesCardTitle} tag="h2">
              {texts.issues.title}
              {activeType !== defaultType && (
                <span
                  className={classNames.use(
                    styles.issuesCardErrorsCount,
                    `${
                      styles[
                        `issuesCardErrorsCount${
                          activeType[0].toUpperCase() +
                          activeType.slice(1).toLowerCase()
                        }`
                      ]
                    }`
                  )}
                >
                  {issueList.length}
                </span>
              )}
            </Card.Title>
            <div className={styles.buttonGroup}>
              {texts.actions.map((button) => (
                <Button
                  key={button.action}
                  onClick={() => onChangeIssueList(button.action)}
                  variant={
                    activeType === button.action ? 'contained' : 'outlined'
                  }
                  className={styles.actionButton}
                >
                  {button.name}
                </Button>
              ))}
            </div>
          </div>
          {issueList && (
            <TypesList issuesByType={issuesByType} typesList={issueList} />
          )}
        </Card>
      </Tag>
    )
  }
)

export default HarvestingPageTemplate
