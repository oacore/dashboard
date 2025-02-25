import React from 'react'
import {
  BarChart,
  Bar,
  LabelList,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { Icon } from '@oacore/design'

import styles from '../styles.module.css'
import Actions from '../../../components/actions'
import compliance from '../../../texts/depositing/compliance.yml'

import { PaymentRequiredError } from 'store/errors'
import { Card } from 'design'
import ExportButton from 'components/export-button'
import { PaymentRequiredNote } from 'modules/billing'
import * as texts from 'texts/depositing'
import { formatNumber } from 'utils/helpers'
import CustomTooltip from 'design/tooltip'

const CustomStatisticsChart = ({
  data,
  className,
  colors,
  width = '40%',
  height = 230,
  labelsPosition = 'top',
  ...restProps
}) => (
  <ResponsiveContainer
    className={styles.chartWrapper}
    width={width}
    height={height}
  >
    <BarChart
      data={data}
      {...restProps}
      margin={{
        top: 20,
        left: -10,
        right: 0,
        bottom: 0,
      }}
    >
      <YAxis type="number" hide />
      <CartesianGrid strokeDasharray="3 0" vertical={false} stroke="#eee" />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="count" isAnimationActive={false}>
        {data.map((entry, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Cell key={`cell-${index}`} fill={colors[entry.name]} />
        ))}
        <LabelList
          formatter={(value) =>
            `${formatNumber(value, { notation: 'compact' })}`
          }
          position={labelsPosition === 'inside' ? 'insideTop' : 'top'}
          fill={labelsPosition === 'inside' ? '#fff' : '#222'}
          dataKey="count"
          className={styles.labelList}
          offset={5}
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)

const Content = ({
  nonCompliantCount,
  resultCount,
  compliantCount,
  exportUrl,
}) => {
  const chartData = [
    {
      name: 'Non-Compliant',
      value: 'Non-compliant in your repository',
      count: nonCompliantCount,
    },
    {
      name: 'Result',
      value: 'Deposited in other repositories',
      count: resultCount,
    },
    {
      name: 'Compliant',
      value: 'Compliant in other repositories',
      count: compliantCount,
    },
  ]

  const colors = {
    'Non-Compliant': '#B75400',
    'Result': '#F5BB95',
    'Compliant': '#FAE2D2',
  }

  return (
    <div className={styles.crossWrapper}>
      <CustomStatisticsChart data={chartData} colors={colors} />
      <div className={styles.crossStats}>
        {chartData.map(({ name, count, value }) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: colors[name],
                marginRight: '10px',
              }}
            />
            <span>{`${value}: ${count}`}</span>
          </div>
        ))}
        {resultCount > 0 && (
          <div className={styles.csvButton}>
            <ExportButton href={exportUrl}>
              {texts.crossRepositoryCheck.download}
            </ExportButton>
          </div>
        )}
      </div>
    </div>
  )
}

const CrossRepositoryCheckCard = ({
  crossDepositLag,
  crossDepositLagCsvUrl,
}) => (
  <Card
    id="cross-repository-check"
    tag="section"
    className={styles.chartCardWrapper}
  >
    <div className={styles.numberHeaderWrapper}>
      <Card.Title tag="h2">{texts.crossRepositoryCheck.title}</Card.Title>
      <Actions
        className={styles.actionItem}
        description={compliance.compliance.cross.description}
        hoverIcon={
          <Icon src="#alert-circle-outline" style={{ color: '#757575' }} />
        }
      />
    </div>
    <Card.Description className={styles.cardDescription}>
      {texts.crossRepositoryCheck.description}
    </Card.Description>
    {crossDepositLag ? (
      <Content
        nonCompliantCount={crossDepositLag.nonCompliantCount}
        resultCount={crossDepositLag.possibleBonusCount}
        compliantCount={crossDepositLag.bonusCount}
        exportUrl={crossDepositLagCsvUrl}
      />
    ) : (
      'Loading data'
    )}
    {crossDepositLag?.error instanceof PaymentRequiredError && (
      <PaymentRequiredNote
        template={texts.crossRepositoryCheck.paymentRequired}
      />
    )}
  </Card>
)

export default CrossRepositoryCheckCard
