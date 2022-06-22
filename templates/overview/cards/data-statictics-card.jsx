import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import OverviewCard from './overview-card'

import AreaChart from 'components/area-chart'
import useHarvestingDate from 'utils/hooks/use-harvesting-dates'
import { valueOrDefault, formatDate } from 'utils/helpers'
import { Card } from 'design'
import NumericValue from 'components/numeric-value'
import text from 'texts/harvesting'
import Markdown from 'components/markdown'
import COLORS from 'utils/colors'
import PerformanceChart from 'components/performance-chart'
import Actions from 'components/actions'
import ActionButton from 'components/action-button'

const ActionsBar = ({ onSetActiveType, activeType }) => {
  const onButtonClick = (name) => {
    onSetActiveType(name)
  }

  return (
    <div>
      {Object.values(text.actions).map(({ name }) => (
        <ActionButton
          onClick={() => onButtonClick(name)}
          key={name}
          text={name}
          active={activeType === name}
        />
      ))}
      <Actions description={text.cardTooltip} />
    </div>
  )
}

const FullTextsProgressChart = ({
  value,
  chartValues,
  caption,
  fullTextCount,
}) => (
  <div className={classNames.use(styles.infoCardChart, styles.infoBox)}>
    <PerformanceChart
      minHeight={110}
      rounded
      className={styles.infoChart}
      values={chartValues}
      value={value}
      valueSize="extra-small"
    />
    <NumericValue
      className={styles.label}
      value={valueOrDefault(fullTextCount, 'Loading...')}
      size="extra-small"
      caption={caption}
    />
  </div>
)

const DataStatisticsCard = ({
  metadatadaHistory,
  metadataCount,
  fullTextCount,
  dataProviderId,
  harvestingDate,
  errorCount,
  warningCount,
  viewStatistics,
  ...restProps
}) => {
  const defaultActiveFilterType = text.actions.find(
    (action) => action.defaultActive
  ).name
  const { barChartValues, activeType, onSetActiveType } = useHarvestingDate(
    metadatadaHistory,
    defaultActiveFilterType
  )

  const perfomanceChartValues = [
    {
      name: 'Full text',
      value: fullTextCount,
      color: COLORS.primary,
    },
    {
      name: 'Without full text',
      value: metadataCount - fullTextCount,
      color: COLORS.gray200,
    },
  ]
  return (
    <OverviewCard className={styles.infoCard} {...restProps}>
      <div className={styles.cardHeader}>
        <Card.Title tag="h2">{text.title}</Card.Title>
        {barChartValues.length > 5 && (
          <ActionsBar
            activeType={activeType}
            onSetActiveType={onSetActiveType}
          />
        )}
      </div>
      <div className={styles.infoCardContent}>
        <div className={styles.infoBox}>
          <Markdown
            className={classNames.use(styles.subtitle, styles.metadata)}
          >
            {text.metadata.title}
          </Markdown>
          <NumericValue
            bold
            tag="p"
            value={valueOrDefault(metadataCount, 'Loading...')}
          />
        </div>
        {fullTextCount && (
          <FullTextsProgressChart
            fullTextCount={fullTextCount}
            chartValues={perfomanceChartValues}
            caption={text.metadata.caption}
            value={valueOrDefault((fullTextCount / metadataCount) * 100, '🔁')}
          />
        )}
      </div>
      {barChartValues.length > 5 ? (
        <AreaChart
          data={barChartValues.map(({ date, value }) => ({
            'name': formatDate(date, {
              month: 'short',
              year: '2-digit',
            }),
            'Metadata count': value,
          }))}
        />
      ) : (
        <p>No compliance-aggregate for repository</p>
      )}
    </OverviewCard>
  )
}
export default DataStatisticsCard
