import { CrHeader, CrFeatureLayout } from '@core/core-ui';
import { TextData } from '@features/Sdg/texts';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { useState, useEffect } from 'react';
import ChartToggler from '@features/Sdg/components/chartToggler.tsx';
import { sdgTypes } from '@components/common/CrSdgRendered/use-sdg-icon-renderer.tsx';
import { useSdgYearData } from '@features/Sdg/hooks/useSdgYearData';
import { useDataProviderStore } from '@/store/dataProviderStore';
import classNames from 'classnames';
import { formatNumber } from '@utils/helpers.ts';
import type { SdgDataItem } from '@features/Sdg/types/sdg.types';
import { SdgTable } from '@features/Sdg/components/sdgTable.tsx';
import useSdgTableData from '@features/Sdg/hooks/useSdgTableData';
import { useSdgTableStore } from '@features/Sdg/store/sdgStore.ts';
import { Popover } from 'antd';
import { useBillingPlanData } from '@features/Orcid/hooks/useBillingPlanData.ts';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation.ts';
import {CrDateRangePicker} from '@components/common/CrDatePicker/CrDatePicker.tsx';

export const SdgFeature = () => {
  const [toggle, setToggle] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState(['all'])
  const [activeTab, setActiveTab] = useState('yearly')

  // Get selected data provider from store
  const { selectedDataProvider } = useDataProviderStore()

  // Get search term and date range from SDG store
  const { searchTerm, setDateRange, dateRange, resetOnPageEnter } = useSdgTableStore()

  useEffect(() => {
    resetOnPageEnter();
  }, [resetOnPageEnter])

  // Get billing plan info
  const { organisation } = useOrganisation();
  const { isStartingPlan: checkBillingType } = useBillingPlanData([] as never[], organisation);


  // Fetch SDG year data using SWR hook
  const {
    sdgYearData,
    sdgYearDataLoading,
    sdgYearDataError,
  } = useSdgYearData({
    dataProviderId: selectedDataProvider?.id || null,
  })

  const {
    data: sdgTableData,
    isLoading: sdgTableDataLoading,
    isLoadingMore,
    loadMore,
    hasMore,
  } = useSdgTableData({
    dataProviderId: selectedDataProvider?.id || null,
    from: 0,
    size: 50,
    searchTerm: searchTerm,
    visibleColumns: visibleColumns,
  })


  const handleToggle = (checked: boolean) => {
    setToggle(checked)
  }

  const handleDateChange = (startDate: number | string, endDate: number | string) => {
    setDateRange(String(startDate), String(endDate))
  }

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev
        return prev.filter((col) => col !== id)
      }
      return [...prev, id]
    })
  }

  // Prepare years array from sdgYearData
  const years =
    sdgYearData?.data && Object.values(sdgYearData?.data).length > 0
      ? Object.keys(Object.values(sdgYearData?.data)[0]?.yearlyData || {})
      : []

  // Transform data for the chart
  const data = years.map((year) => {
    const yearData: Record<string, string | number> = { name: year }
    Object.values(sdgYearData?.data || {}).forEach((sdg: SdgDataItem) => {
      yearData[sdg.type] = sdg.yearlyData[year] || 0
    })
    return yearData
  })

  // Create updatedSdgTypes with outputCount
  const updatedSdgTypes = sdgTypes.map((sdg) => {
    const sdgDataItem = Object.values(sdgYearData?.data || {}).find(
      (dataItem: SdgDataItem) => dataItem.type === sdg.id
    )
    const yearlyDataSum =
      sdgDataItem && sdgDataItem.yearlyData
        ? Object.values(sdgDataItem.yearlyData).reduce(
          (sum: number, value: number) => sum + value,
          0
        )
        : 0
    return {
      ...sdg,
      outputCount: yearlyDataSum,
    }
  })


  const selectedSdgTypes = updatedSdgTypes.filter((sdg) =>
    visibleColumns.includes(sdg.id)
  )

  const outputCount = selectedSdgTypes.some((sdg) => sdg.id === 'all')
    ? selectedSdgTypes.find((sdg) => sdg.id === 'all')?.outputCount || 0
    : selectedSdgTypes.reduce((sum, sdg) => sum + (sdg.outputCount || 0), 0)

  return (
    <CrFeatureLayout>
      <CrHeader
        title={TextData.title}
        showMore={
          <CrShowMore
            text={TextData.description}
            maxLetters={320}
          />
        }
      />
      <div className="picker-wrapper">
        <span className="date-title">Include records from</span>
        <CrDateRangePicker
          outputFormat="year"
          onDateChange={handleDateChange}
          initialStartDate={dateRange.startDate}
          initialEndDate={dateRange.endDate}
        />
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
        error={sdgYearDataError}
      />
      {activeTab === 'yearly' && (
        <div className="sdg-icons">
          {updatedSdgTypes.map((sdg, index) => (
            <div key={sdg.id} className="sdg-icon">
              <div
                onClick={() => toggleColumn(sdg.id)}
              >
                <img
                  className={classNames('sdg-img', {
                    'sdg-img-main': sdg.id === 'all',
                  })}
                  src={sdg.icon}
                  alt={sdg.id}
                />
                {checkBillingType && index > 2 ? (
                  <Popover
                    className="popover"
                    placement="top"
                    content="Become Supporting or Sustaining member to see all information."
                  >
                    <div
                      className={classNames('sdg-body', {
                        'active-sdg-body': visibleColumns.includes(sdg.id),
                        'blur-effect': checkBillingType && index > 2,
                      })}
                    >
                      <span
                        className={classNames('sdg-count', {
                          'active-sdg-count': visibleColumns.includes(sdg.id),
                        })}
                      >
                        {formatNumber(sdg.outputCount)}
                      </span>
                      <p
                        className={classNames('sdg-description', {
                          'active-sdg-description': visibleColumns.includes(sdg.id),
                        })}
                      >
                        outputs
                      </p>
                    </div>
                  </Popover>
                ) : (
                  <div
                    className={classNames('sdg-body', {
                      'active-sdg-body': visibleColumns.includes(sdg.id),
                    })}
                  >
                    <span
                      className={classNames('sdg-count', {
                        'active-sdg-count': visibleColumns.includes(sdg.id),
                      })}
                    >
                      {formatNumber(sdg.outputCount)}
                    </span>
                    <p
                      className={classNames('sdg-description', {
                        'active-sdg-description': visibleColumns.includes(sdg.id),
                      })}
                    >
                      outputs
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <SdgTable
        outputCount={outputCount}
        sdgTableData={sdgTableData}
        loadMore={loadMore}
        loading={sdgTableDataLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
    </CrFeatureLayout>
  )
}
