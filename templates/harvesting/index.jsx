import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'
import HarvestingStatusCard from './cards/harvesting-status-card'
import TypesList from './cards/types-list'
import useTypes from './hooks/use-types'

import Actions from 'components/actions'
import Title from 'components/title'
import { Card, Button } from 'design'
import texts from 'texts/issues'

const HarvestingPageTemplate = ({
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
  ...restProps
}) => {
  const defaultType = texts.actions.find((action) => action.defaultActive)
    .action

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
      <HarvestingStatusCard
        metadataCount={metadataCount}
        lastHarvestingDate={harvestingStatus?.lastHarvestingDate || 0}
        fullTextCount={fullTextCount}
        errorsCount={errorsCount}
      />
      {/* <HarvestingStatusCard /> */}

      {/* <DataStatisticsCard
        metadataCount={metadataCount}
        fullTextCount={fullTextCount}
        harvestingDate={harvestingDate}
        errorCount={errorCount}
        warningCount={warningCount}
        dataProviderId={dataProviderId}
      /> */}
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
            <Actions downloadUrl="#" />
          </div>
        </div>
        {issueList && (
          <TypesList issuesByType={issuesByType} typesList={issueList} />
        )}
      </Card>
    </Tag>
  )
}

export default HarvestingPageTemplate
