import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { classNames } from '@oacore/design/lib/utils'
import { Popover } from '@oacore/design'
import { Button } from '@oacore/design/lib/elements'

import DashboardHeader from '../../components/dashboard-header'
import texts from '../../texts/sdg/sdg.yml'
import sdgLoad from '../../components/upload/assets/sdgLoad.svg'
import styles from './styles.module.css'
import SdgTable from './table/sdgTable'
import { GlobalContext } from '../../store'
import ChartToggler from './charts/chartToggler'
import { formatNumber } from '../../utils/helpers'
import DateRangePicker from '../../components/datePicker/datePicker'
import Markdown from '../../components/markdown'
import Video from '../../components/video/video'
import { sdgTypes } from '../../utils/hooks/use-sdg-icon-renderer'

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
