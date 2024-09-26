import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import { Switch } from '@oacore/design'

import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/sdg/sdg.yml'
import ReChartV2 from './charts/rechartV2'
import all from '../../components/upload/assets/allSdg.svg'
import poverty from '../../components/upload/assets/poverty.svg'
import hunger from '../../components/upload/assets/hunger.svg'
import health from '../../components/upload/assets/health.svg'
import education from '../../components/upload/assets/education.svg'
import equal from '../../components/upload/assets/genderEquality.svg'
import water from '../../components/upload/assets/water.svg'
import energy from '../../components/upload/assets/energy.svg'
import economy from '../../components/upload/assets/economic.svg'
import infrastructure from '../../components/upload/assets/infrastructure.svg'
import inequality from '../../components/upload/assets/inequalitie.svg'
import communities from '../../components/upload/assets/communities.svg'
import production from '../../components/upload/assets/production.svg'
import climate from '../../components/upload/assets/climate.svg'
import underWater from '../../components/upload/assets/belowWater.svg'
import land from '../../components/upload/assets/land.svg'
import peace from '../../components/upload/assets/peace.svg'
import goal from '../../components/upload/assets/goal.svg'
import povertyH from '../../components/upload/assets/povertyH.svg'
import hungerH from '../../components/upload/assets/hungerH.svg'
import healthH from '../../components/upload/assets/healthH.svg'
import educationH from '../../components/upload/assets/educationH.svg'
import equalH from '../../components/upload/assets/genderH.svg'
import waterH from '../../components/upload/assets/waterH.svg'
import energyH from '../../components/upload/assets/energyH.svg'
import economyH from '../../components/upload/assets/economicH.svg'
import infrastructureH from '../../components/upload/assets/infraH.svg'
import inequalityH from '../../components/upload/assets/inequalH.svg'
import communitiesH from '../../components/upload/assets/communityH.svg'
import productionH from '../../components/upload/assets/productionH.svg'
import climateH from '../../components/upload/assets/climateH.svg'
import underWaterH from '../../components/upload/assets/belowWaterH.svg'
import landH from '../../components/upload/assets/landH.svg'
import peaceH from '../../components/upload/assets/peaceH.svg'
import goalH from '../../components/upload/assets/goalH.svg'
import styles from './styles.module.css'
import HorizontalChart from './charts/horizontalSdgChart'
import SdgTable from './table/sdgTable'

const sdgTypes = [
  {
    id: 'all',
    icon: all,
    color: '#B75400',
  },
  {
    id: 'poverty',
    icon: poverty,
    iconH: povertyH,
    color: '#E5243B',
  },
  {
    id: 'hunger',
    icon: hunger,
    iconH: hungerH,
    color: '#DDA63A',
  },
  {
    id: 'health',
    icon: health,
    iconH: healthH,
    color: '#4C9F38',
  },
  {
    id: 'education',
    icon: education,
    iconH: educationH,
    color: '#C5192D',
  },
  {
    id: 'equal',
    icon: equal,
    iconH: equalH,
    color: '#FF3A21',
  },
  {
    id: 'water',
    icon: water,
    iconH: waterH,
    color: '#26BDE2',
  },
  {
    id: 'energy',
    icon: energy,
    iconH: energyH,
    color: '#FCC30B',
  },
  {
    id: 'economy',
    icon: economy,
    iconH: economyH,
    color: '#A21942',
  },
  {
    id: 'infrastructure',
    icon: infrastructure,
    iconH: infrastructureH,
    color: '#FD6925',
  },
  {
    id: 'inequality',
    icon: inequality,
    iconH: inequalityH,
    color: '#DD1367',
  },
  {
    id: 'communities',
    icon: communities,
    iconH: communitiesH,
    color: '#FD9D24',
  },
  {
    id: 'production',
    icon: production,
    iconH: productionH,
    color: '#BF8B2E',
  },
  {
    id: 'climate',
    icon: climate,
    iconH: climateH,
    color: '#3F7E44',
  },
  {
    id: 'underWater',
    icon: underWater,
    iconH: underWaterH,
    color: '#0A97D9',
  },
  {
    id: 'land',
    icon: land,
    iconH: landH,
    color: '#56C02B',
  },
  {
    id: 'peace',
    icon: peace,
    iconH: peaceH,
    color: '#00689D',
  },
  {
    id: 'goal',
    icon: goal,
    iconH: goalH,
    color: '#19486A',
  },
]

export const sdgData = [
  {
    id: 'all',
    title: 'all',
    yearlyData: {
      2011: 500,
      2012: 750,
      2013: 80,
      2017: 350,
      2019: 400,
      2020: 450,
      2021: 550,
      2022: 650,
      2023: 750,
      2024: 850,
    },
  },
  {
    id: 'poverty',
    title: 'poverty',
    yearlyData: {
      2011: 60,
      2012: 55,
      2013: 35,
      2017: 25,
      2019: 100,
      2020: 110,
      2021: 120,
      2022: 130,
      2023: 140,
      2024: 150,
    },
  },
  {
    id: 'hunger',
    title: 'hunger',
    yearlyData: {
      2011: 20,
      2012: 100,
      2013: 20,
      2017: 50,
      2019: 30,
      2020: 40,
      2021: 50,
      2022: 60,
      2023: 70,
      2024: 80,
    },
  },
  {
    id: 'health',
    title: 'health',
    yearlyData: {
      2011: 10,
      2012: 20,
      2013: 30,
      2017: 40,
      2019: 50,
      2020: 60,
      2021: 70,
      2022: 80,
      2023: 90,
      2024: 100,
    },
  },
  {
    id: 'education',
    title: 'education',
    yearlyData: {
      2011: 10,
      2012: 100,
      2013: 100,
      2017: 10,
      2019: 200,
      2020: 210,
      2021: 220,
      2022: 230,
      2023: 240,
      2024: 250,
    },
  },
  {
    id: 'equal',
    title: 'equal',
    yearlyData: {
      2011: 30,
      2012: 40,
      2013: 50,
      2017: 10,
      2019: 20,
      2020: 30,
      2021: 40,
      2022: 50,
      2023: 60,
      2024: 70,
    },
  },
  {
    id: 'water',
    title: 'water',
    yearlyData: {
      2011: 50,
      2012: 75,
      2013: 8,
      2017: 35,
      2019: 40,
      2020: 45,
      2021: 55,
      2022: 65,
      2023: 75,
      2024: 85,
    },
  },
  {
    id: 'energy',
    title: 'energy',
    yearlyData: {
      2011: 60,
      2012: 55,
      2013: 35,
      2017: 25,
      2019: 100,
      2020: 110,
      2021: 120,
      2022: 130,
      2023: 140,
      2024: 150,
    },
  },
  {
    id: 'economy',
    title: 'economy',
    yearlyData: {
      2011: 20,
      2012: 100,
      2013: 20,
      2017: 50,
      2019: 30,
      2020: 40,
      2021: 50,
      2022: 60,
      2023: 70,
      2024: 80,
    },
  },
  {
    id: 'infrastructure',
    title: 'infrastructure',
    yearlyData: {
      2011: 10,
      2012: 20,
      2013: 30,
      2017: 40,
      2019: 50,
      2020: 60,
      2021: 70,
      2022: 80,
      2023: 90,
      2024: 100,
    },
  },
  {
    id: 'inequality',
    title: 'inequality',
    yearlyData: {
      2011: 10,
      2012: 100,
      2013: 100,
      2017: 10,
      2019: 200,
      2020: 210,
      2021: 220,
      2022: 230,
      2023: 240,
      2024: 250,
    },
  },
  {
    id: 'communities',
    title: 'communities',
    yearlyData: {
      2011: 30,
      2012: 40,
      2013: 50,
      2017: 10,
      2019: 20,
      2020: 30,
      2021: 40,
      2022: 50,
      2023: 60,
      2024: 70,
    },
  },
  {
    id: 'production',
    title: 'production',
    yearlyData: {
      2011: 50,
      2012: 75,
      2013: 8,
      2017: 35,
      2019: 40,
      2020: 45,
      2021: 55,
      2022: 65,
      2023: 75,
      2024: 85,
    },
  },
  {
    id: 'climate',
    title: 'climate',
    yearlyData: {
      2011: 60,
      2012: 55,
      2013: 35,
      2017: 25,
      2019: 100,
      2020: 110,
      2021: 120,
      2022: 130,
      2023: 140,
      2024: 150,
    },
  },
  {
    id: 'underWater',
    title: 'underWater',
    yearlyData: {
      2011: 20,
      2012: 100,
      2013: 20,
      2017: 50,
      2019: 30,
      2020: 40,
      2021: 50,
      2022: 60,
      2023: 70,
      2024: 80,
    },
  },
  {
    id: 'land',
    title: 'land',
    yearlyData: {
      2011: 10,
      2012: 20,
      2013: 30,
      2017: 40,
      2019: 50,
      2020: 60,
      2021: 70,
      2022: 80,
      2023: 90,
      2024: 100,
    },
  },
  {
    id: 'peace',
    title: 'peace',
    yearlyData: {
      2011: 10,
      2012: 100,
      2013: 100,
      2017: 10,
      2019: 200,
      2020: 210,
      2021: 220,
      2022: 230,
      2023: 240,
      2024: 250,
    },
  },
  {
    id: 'goal',
    title: 'goal',
    yearlyData: {
      2011: 30,
      2012: 40,
      2013: 50,
      2017: 10,
      2019: 20,
      2020: 30,
      2021: 40,
      2022: 50,
      2023: 60,
      2024: 70,
    },
  },
]

const SdgPageTemplate = observer(
  ({ tag: Tag = 'main', className, ...restProps }) => {
    const [toggle, setToggle] = useState(false)

    const handleToggle = (event) => {
      setToggle(event.target.checked)
    }

    const years = Object.keys(sdgData[0].yearlyData)

    const data = years.map((year) => {
      const yearData = { name: year }
      sdgData.forEach((sdg) => {
        yearData[sdg.id] = sdg.yearlyData[year] || 0
      })
      return yearData
    })

    const updatedSdgTypes = sdgTypes.map((sdg) => {
      // eslint-disable-next-line no-shadow
      const sdgDataItem = sdgData.find((data) => data.id === sdg.id)
      const yearlyDataSum = sdgDataItem
        ? Object.values(sdgDataItem.yearlyData).reduce(
            (sum, value) => sum + value,
            0
          )
        : 0
      return {
        ...sdg,
        outputCount: yearlyDataSum,
      }
    })

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
        {...restProps}
      >
        <DashboardHeader title={texts.title} description={texts.description} />
        <div className={styles.toggleWrapper}>
          <Switch
            id="sdg-toggle"
            checked={toggle}
            onChange={handleToggle}
            label={texts.chart.toggle.title}
            className={styles.toggleSwitch}
          />
        </div>
        {toggle ? (
          <HorizontalChart sdgTypes={sdgTypes} data={updatedSdgTypes} />
        ) : (
          <ReChartV2
            sdgTypes={sdgTypes}
            data={data}
            updatedSdgTypes={updatedSdgTypes}
          />
        )}
        <SdgTable />
      </Tag>
    )
  }
)
export default SdgPageTemplate
