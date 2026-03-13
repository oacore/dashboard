import all from '../../../assets/icons/allSdg.svg'
import poverty from '../../../assets/icons/poverty.svg'
import povertyH from '../../../assets/icons/povertyH.svg'
import hunger from '../../../assets/icons/hunger.svg'
import hungerH from '../../../assets/icons/hungerH.svg'
import health from '../../../assets/icons/health.svg'
import healthH from '../../../assets/icons/healthH.svg'
import education from '../../../assets/icons/education.svg'
import educationH from '../../../assets/icons/educationH.svg'
import equal from '../../../assets/icons/genderEquality.svg'
import equalH from '../../../assets/icons/genderH.svg'
import water from '../../../assets/icons/water.svg'
import waterH from '../../../assets/icons/waterH.svg'
import energy from '../../../assets/icons/energy.svg'
import energyH from '../../../assets/icons/energyH.svg'
import economy from '../../../assets/icons/economic.svg'
import economyH from '../../../assets/icons/economicH.svg'
import infrastructure from '../../../assets/icons/infrastructure.svg'
import infrastructureH from '../../../assets/icons/infraH.svg'
import inequality from '../../../assets/icons/inequalitie.svg'
import inequalityH from '../../../assets/icons/inequalH.svg'
import communities from '../../../assets/icons/communities.svg'
import communitiesH from '../../../assets/icons/communityH.svg'
import production from '../../../assets/icons/production.svg'
import productionH from '../../../assets/icons/productionH.svg'
import climate from '../../../assets/icons/climate.svg'
import climateH from '../../../assets/icons/climateH.svg'
import underWater from '../../../assets/icons/belowWater.svg'
import underWaterH from '../../../assets/icons/belowWaterH.svg'
import land from '../../../assets/icons/land.svg'
import landH from '../../../assets/icons/landH.svg'
import peace from '../../../assets/icons/peace.svg'
import peaceH from '../../../assets/icons/peaceH.svg'
import goal from '../../../assets/icons/goal.svg'
import goalH from '../../../assets/icons/goalH.svg'
import {Tooltip} from 'antd';
import "./styles.css"

interface SdgType {
  id: string
  title: string
  icon: string
  iconH?: string
  color: string
}

export const sdgTypes: SdgType[] = [
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

export const getSdgIcon = (type: string, score: number): React.ReactNode => {
  const sdg = sdgTypes.find((sdgItem) => sdgItem.id === type)

  if (!sdg) {
    return type
  }

  return (
    <Tooltip placement="top" title={`${sdg.title} - ${score} (confidence)`}>
      <img className="sdg-indicator" src={sdg.icon} alt={type} />
    </Tooltip>
  )
}

