import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import useHarvestingDate from 'utils/hooks/use-harvesting-dates'
import StatisticsChart from 'components/statistics-chart'
import { valueOrDefault, formatDate } from 'utils/helpers'
import Loader from 'components/loader'
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
      <Actions />
    </div>
  )
}

const FullTextsProgressChart = ({
  value,
  chartValues,
  caption,
  fullTextCount,
}) => (
  <div className={styles.infoCardChart}>
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
  const activeFilterType = text.actions.find((action) => action.defaultActive)
    .name
  const { barChartValues, activeType, onSetActiveType } = useHarvestingDate(
    metadatadaHistory,
    activeFilterType
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
    <Card className={styles.infoCard} {...restProps} title={text.cardTooltip}>
      <div className={styles.cardHeader}>
        <Card.Title tag="h2">{text.title}</Card.Title>
        <ActionsBar activeType={activeType} onSetActiveType={onSetActiveType} />
      </div>

      <Markdown className={classNames.use(styles.subtitle, styles.metadata)}>
        {text.metadata.title}
      </Markdown>

      {!metadataCount || !fullTextCount ? (
        <Loader width={100} />
      ) : (
        <>
          <NumericValue
            bold
            tag="p"
            value={valueOrDefault(metadataCount, 'Loading...')}
          />

          <FullTextsProgressChart
            fullTextCount={fullTextCount}
            chartValues={perfomanceChartValues}
            caption={text.metadata.caption}
            value={valueOrDefault((fullTextCount / metadataCount) * 100, '🔁')}
          />
          {barChartValues.length > 0 && (
            <StatisticsChart
              data={barChartValues.map(({ date, value }) => ({
                'name': formatDate(date, {
                  day: 'numeric',
                  month: 'numeric',
                  year: '2-digit',
                }),
                'Metadata count': value,
              }))}
              labelsPosition="inside"
              colors={{
                'Metadata count': 'var(--primary)',
              }}
            />
          )}
        </>
      )}
    </Card>
  )
}
export default DataStatisticsCard
