import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts'
import { classNames } from '@oacore/design/lib/utils'

import texts from '../../../texts/sdg/sdg.yml'
import styles from '../styles.module.css'
import Markdown from '../../../components/markdown'
import text from '../../../texts/harvesting'
import NumericValue from '../../../components/numeric-value'
import { valueOrDefault } from '../../../utils/helpers'

const ReChartV2 = ({ sdgTypes, data, updatedSdgTypes }) => {
  const [visibleColumns, setVisibleColumns] = useState(['all'])

  const toggleColumn = (id) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((col) => col !== id) : [...prev, id]
    )
  }

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.innerChartWrapper}>
        <h1>{texts.chart.table.title}</h1>
        <div className={styles.infoBox}>
          <Markdown className={`${styles.subtitle} ${styles.metadata}`}>
            {text.metadata.title}
          </Markdown>
          <NumericValue
            bold
            tag="p"
            value={valueOrDefault(1211, 'Loading...')}
          />
        </div>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {sdgTypes
                .filter((sdg) => visibleColumns.includes(sdg.id))
                .map((sdg) => (
                  <Bar key={sdg.id} dataKey={sdg.id} fill={sdg.color}>
                    <LabelList dataKey={sdg.id} position="top" />
                  </Bar>
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={styles.sdgIcons}>
        {updatedSdgTypes.map((sdg) => (
          <div key={sdg.id} className={styles.sdgIcon}>
            {/* eslint-disable-next-line react/button-has-type */}
            <button onClick={() => toggleColumn(sdg.id)}>
              <img
                className={classNames.use(styles.sdgImg, {
                  [styles.sdgImgMain]: sdg.id === 'all',
                })}
                src={sdg.icon}
                alt={sdg.id}
              />
              <div className={styles.sdgBody}>
                <span className={styles.sdgCount}>{sdg.outputCount}</span>
                <p className={styles.sdgDescription}>outputs</p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ReChartV2
