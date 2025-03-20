import React from 'react'
import { Popover } from '@oacore/design'

import styles from '../../templates/sdg/styles.module.css'
import all from '../../components/upload/assets/allSdg.svg'
import poverty from '../../components/upload/assets/poverty.svg'
import povertyH from '../../components/upload/assets/povertyH.svg'
import hunger from '../../components/upload/assets/hunger.svg'
import hungerH from '../../components/upload/assets/hungerH.svg'
import health from '../../components/upload/assets/health.svg'
import healthH from '../../components/upload/assets/healthH.svg'
import education from '../../components/upload/assets/education.svg'
import educationH from '../../components/upload/assets/educationH.svg'
import equal from '../../components/upload/assets/genderEquality.svg'
import equalH from '../../components/upload/assets/genderH.svg'
import water from '../../components/upload/assets/water.svg'
import waterH from '../../components/upload/assets/waterH.svg'
import energy from '../../components/upload/assets/energy.svg'
import energyH from '../../components/upload/assets/energyH.svg'
import economy from '../../components/upload/assets/economic.svg'
import economyH from '../../components/upload/assets/economicH.svg'
import infrastructure from '../../components/upload/assets/infrastructure.svg'
import infrastructureH from '../../components/upload/assets/infraH.svg'
import inequality from '../../components/upload/assets/inequalitie.svg'
import inequalityH from '../../components/upload/assets/inequalH.svg'
import communities from '../../components/upload/assets/communities.svg'
import communitiesH from '../../components/upload/assets/communityH.svg'
import production from '../../components/upload/assets/production.svg'
import productionH from '../../components/upload/assets/productionH.svg'
import climate from '../../components/upload/assets/climate.svg'
import climateH from '../../components/upload/assets/climateH.svg'
import underWater from '../../components/upload/assets/belowWater.svg'
import underWaterH from '../../components/upload/assets/belowWaterH.svg'
import land from '../../components/upload/assets/land.svg'
import landH from '../../components/upload/assets/landH.svg'
import peace from '../../components/upload/assets/peace.svg'
import peaceH from '../../components/upload/assets/peaceH.svg'
import goal from '../../components/upload/assets/goal.svg'
import goalH from '../../components/upload/assets/goalH.svg'

export const sdgTypes = [
  {
    id: 'all',
    title: 'All',
    icon: all,
    color: '#B75400',
  },
  {
    id: 'SDG01',
    title: 'No Poverty',
    icon: poverty,
    iconH: povertyH,
    color: '#E5243B',
  },
  {
    id: 'SDG02',
    title: 'Zero Hunger',
    icon: hunger,
    iconH: hungerH,
    color: '#DDA63A',
  },
  {
    id: 'SDG03',
    title: 'Good Health and Well-being',
    icon: health,
    iconH: healthH,
    color: '#4C9F38',
  },
  {
    id: 'SDG04',
    title: 'Quality Education',
    icon: education,
    iconH: educationH,
    color: '#C5192D',
  },
  {
    id: 'SDG05',
    title: 'Gender Equality',
    icon: equal,
    iconH: equalH,
    color: '#FF3A21',
  },
  {
    id: 'SDG06',
    title: 'Clean Water and Sanitation',
    icon: water,
    iconH: waterH,
    color: '#26BDE2',
  },
  {
    id: 'SDG07',
    title: 'Affordable and Clean Energy',
    icon: energy,
    iconH: energyH,
    color: '#FCC30B',
  },
  {
    id: 'SDG08',
    title: 'Decent Work and Economic Growth',
    icon: economy,
    iconH: economyH,
    color: '#A21942',
  },
  {
    id: 'SDG09',
    title: 'Industry, Innovation and Infrastructure',
    icon: infrastructure,
    iconH: infrastructureH,
    color: '#FD6925',
  },
  {
    id: 'SDG10',
    title: 'Reduced Inequality',
    icon: inequality,
    iconH: inequalityH,
    color: '#DD1367',
  },
  {
    id: 'SDG11',
    title: 'Sustainable Cities and Communities',
    icon: communities,
    iconH: communitiesH,
    color: '#FD9D24',
  },
  {
    id: 'SDG12',
    title: 'Responsible Consumption and Production',
    icon: production,
    iconH: productionH,
    color: '#BF8B2E',
  },
  {
    id: 'SDG13',
    title: 'Climate Action',
    icon: climate,
    iconH: climateH,
    color: '#3F7E44',
  },
  {
    id: 'SDG14',
    title: 'Life Below Water',
    icon: underWater,
    iconH: underWaterH,
    color: '#0A97D9',
  },
  {
    id: 'SDG15',
    title: 'Life on Land',
    icon: land,
    iconH: landH,
    color: '#56C02B',
  },
  {
    id: 'SDG16',
    title: 'Peace, Justice and Strong Institutions',
    icon: peace,
    iconH: peaceH,
    color: '#00689D',
  },
  {
    id: 'SDG17',
    title: 'Partnerships for the Goals',
    icon: goal,
    iconH: goalH,
    color: '#19486A',
  },
]

const getSdgIcon = (type, score) => {
  const sdg = sdgTypes.find((sdgItem) => sdgItem.id === type)
  return sdg ? (
    <Popover placement="top" content={`${sdg.title} - ${score} (confidence)`}>
      <img className={styles.sdgItem} src={sdg.icon} alt={type} />
    </Popover>
  ) : (
    type
  )
}

export default getSdgIcon
