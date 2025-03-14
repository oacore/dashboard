import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import { Popover } from '@oacore/design'
import { Button } from '@oacore/design/lib/elements'

import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/sdg/sdg.yml'
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
import sdgLoad from '../../components/upload/assets/sdgLoad.svg'
import styles from './styles.module.css'
import SdgTable from './table/sdgTable'
import { GlobalContext } from '../../store'
import ChartToggler from './charts/chartToggler'
import { formatNumber } from '../../utils/helpers'
import DateRangePicker from '../../components/datePicker/datePicker'
import Markdown from '../../components/markdown'
import Video from '../../components/video/video'

const sdgTypes = [
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

const SdgPageTemplate = observer(
  ({
    tag: Tag = 'main',
    className,
    sdgUrl,
    sdgTableList,
    sdgTableDataLoading,
    getSdgTableData,
    getSdgYearData,
    sdgYearData,
    articleAdditionalData,
    articleAdditionalDataLoading,
    sdgYearDataLoading,
    billingPlan,
    generateSdgReport,
    ...restProps
  }) => {
    const { ...globalStore } = useContext(GlobalContext)
    const [toggle, setToggle] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(['all'])
    const [activeTab, setActiveTab] = useState('yearly')
    const [checkBillingType, setCheckBillingType] = useState(false)
    const [dateRange, setDateRange] = useState({
      startDate: '2012',
      endDate: '2024',
    })
    const [reportGenerated, setReportGenerated] = useState(
      JSON.parse(
        localStorage.getItem(`reportGenerated_${globalStore.dataProvider.id}`)
      ) || false
    )

    const toggleColumn = (id, index) => {
      if (checkBillingType && index > 2) return

      setVisibleColumns((prev) => {
        if (prev.includes(id)) {
          if (prev.length === 1) return prev
          return prev.filter((col) => col !== id)
        }
        return [...prev, id]
      })
    }

    useEffect(() => {
      getSdgYearData(globalStore.dataProvider.id)
    }, [globalStore.dataProvider.id])

    useEffect(() => {
      if (
        globalStore.dataProvider.id &&
        dateRange.startDate &&
        dateRange.endDate
      ) {
        getSdgYearData(
          globalStore.dataProvider.id,
          dateRange.startDate,
          dateRange.endDate
        )
      }
    }, [globalStore.dataProvider.id, dateRange.startDate, dateRange.endDate])

    const handleToggle = (event) => {
      setToggle(event.target.checked)
    }

    const handleDateChange = (startDate, endDate) => {
      setDateRange({ startDate, endDate })
    }

    const years =
      sdgYearData?.data && Object.values(sdgYearData?.data).length > 0
        ? Object.keys(Object.values(sdgYearData?.data)[0]?.yearlyData || {})
        : []

    const data = years.map((year) => {
      const yearData = { name: year }
      Object.values(sdgYearData?.data).forEach((sdg) => {
        yearData[sdg.type] = sdg.yearlyData[year] || 0
      })
      return yearData
    })

    const updatedSdgTypes = sdgTypes.map((sdg) => {
      const sdgDataItem = Object.values(sdgYearData?.data || {}).find(
        // eslint-disable-next-line no-shadow
        (data) => data.type === sdg.id
      )
      const yearlyDataSum =
        sdgDataItem && sdgDataItem.yearlyData
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

    useEffect(() => {
      setCheckBillingType(billingPlan?.billingType === 'starting')
    }, [billingPlan])

    const selectedSdgTypes = updatedSdgTypes.filter((sdg) =>
      visibleColumns.includes(sdg.id)
    )
    const outputCount = selectedSdgTypes.some((sdg) => sdg.id === 'all')
      ? selectedSdgTypes.find((sdg) => sdg.id === 'all').outputCount
      : selectedSdgTypes.reduce((sum, sdg) => sum + sdg.outputCount, 0)

    const handleGenerateReport = async () => {
      try {
        const response = await generateSdgReport(globalStore.dataProvider.id)
        if (response.ok) {
          setReportGenerated(true)
          localStorage.setItem(
            `reportGenerated_${globalStore.dataProvider.id}`,
            true
          )
        } else {
          setReportGenerated(false)
          localStorage.setItem(
            `reportGenerated_${globalStore.dataProvider.id}`,
            false
          )
        }
      } catch (error) {
        setReportGenerated(false)
        localStorage.setItem(
          `reportGenerated_${globalStore.dataProvider.id}`,
          false
        )
        console.error('Error generating SDG report:', error)
      }
    }

    return (
      <Tag
        className={classNames.use(styles.container).join(className)}
        {...restProps}
      >
        {sdgYearData.data?.all?.yearlyData ? (
          <>
            <DashboardHeader
              title={texts.title}
              description={texts.description}
            />
            <div className={styles.pickerWrapper}>
              <span className={styles.dateTitle}>Include records from</span>
              <DateRangePicker onDateChange={handleDateChange} />
            </div>
            <ChartToggler
              handleToggle={handleToggle}
              toggle={toggle}
              sdgTypes={sdgTypes}
              updatedSdgTypes={updatedSdgTypes}
              data={data}
              sdgYearDataLoading={sdgYearDataLoading}
              visibleColumns={visibleColumns}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              checkBillingType={checkBillingType}
            />
            {activeTab === 'yearly' && (
              <div className={styles.sdgIcons}>
                {updatedSdgTypes.map((sdg, index) => (
                  <div key={sdg.id} className={styles.sdgIcon}>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      onClick={() => toggleColumn(sdg.id, index)}
                      disabled={checkBillingType && index > 2}
                    >
                      <img
                        className={classNames.use(styles.sdgImg, {
                          [styles.sdgImgMain]: sdg.id === 'all',
                        })}
                        src={sdg.icon}
                        alt={sdg.id}
                      />
                      {checkBillingType && index > 2 ? (
                        <Popover
                          className={styles.popover}
                          placement="top"
                          content="Become Supporting or Sustaining member to see all information."
                        >
                          <div
                            className={classNames.use(styles.sdgBody, {
                              [styles.activeSdgBody]: visibleColumns.includes(
                                sdg.id
                              ),
                              [styles.blurEffect]:
                                checkBillingType && index > 2,
                            })}
                          >
                            <span
                              className={classNames.use(styles.sdgCount, {
                                [styles.activeSdgCount]:
                                  visibleColumns.includes(sdg.id),
                              })}
                            >
                              {formatNumber(sdg.outputCount)}
                            </span>
                            <p
                              className={classNames.use(styles.sdgDescription, {
                                [styles.activeSdgDescription]:
                                  visibleColumns.includes(sdg.id),
                              })}
                            >
                              outputs
                            </p>
                          </div>
                        </Popover>
                      ) : (
                        <div
                          className={classNames.use(styles.sdgBody, {
                            [styles.activeSdgBody]: visibleColumns.includes(
                              sdg.id
                            ),
                          })}
                        >
                          <span
                            className={classNames.use(styles.sdgCount, {
                              [styles.activeSdgCount]: visibleColumns.includes(
                                sdg.id
                              ),
                            })}
                          >
                            {formatNumber(sdg.outputCount)}
                          </span>
                          <p
                            className={classNames.use(styles.sdgDescription, {
                              [styles.activeSdgDescription]:
                                visibleColumns.includes(sdg.id),
                            })}
                          >
                            outputs
                          </p>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <SdgTable
              visibleColumns={visibleColumns}
              sdgUrl={sdgUrl}
              getSdgTableData={getSdgTableData}
              sdgTableList={sdgTableList}
              sdgTableDataLoading={sdgTableDataLoading}
              sdgTypes={sdgTypes}
              articleAdditionalData={articleAdditionalData}
              articleAdditionalDataLoading={articleAdditionalDataLoading}
              outputCount={outputCount}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              checkBillingType={checkBillingType}
            />
          </>
        ) : (
          <>
            <DashboardHeader
              title={texts.noSdg.title}
              description={texts.noSdg.description}
            />
            <div className={styles.sdgSuggestionWrapper}>
              <div className={styles.sdgInnerSuggestionWrapper}>
                <img src={sdgLoad} alt="sdgLoad" />
                <Markdown className={styles.sdgSuggestionDescription}>
                  {texts.sdgSuggestion.description}
                </Markdown>
                {reportGenerated ? (
                  <div className={styles.messageWrapper}>
                    {texts.noSdg.message}
                  </div>
                ) : (
                  <Button variant="contained" onClick={handleGenerateReport}>
                    {texts.noSdg.button}
                  </Button>
                )}
              </div>
              <Video
                src="https://www.youtube.com/embed/_r16dXOGdWA"
                title="sdg labels"
                tag="p"
                className={styles.videoWrapper}
              />
            </div>
          </>
        )}
      </Tag>
    )
  }
)
export default SdgPageTemplate
