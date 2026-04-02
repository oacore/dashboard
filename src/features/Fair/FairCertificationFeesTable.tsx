import type { ReactNode } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Markdown } from '@oacore/core-ui';
import type { FairPricingHeader, FairPricingTable } from './fairPricingTypes';
import { findPrice, formatGbp } from './fairPricingUtils';

export type FairCertificationFeesTableProps = {
  config: FairPricingTable;
};

type FeesRecord = {
  key: string;
  band: ReactNode;
} & Partial<Record<'low' | 'middle' | 'high', ReactNode>>;

export const FairCertificationFeesTable = ({ config }: FairCertificationFeesTableProps) => {
  const incomeHeaders = config.headers.filter(
    (h): h is FairPricingHeader & { type: 'low' | 'middle' | 'high' } =>
      h.type === 'low' || h.type === 'middle' || h.type === 'high'
  );

  const dataSource: FeesRecord[] = config.certification.subRows.map((row) => {
    const record: FeesRecord = {
      key: row.title,
      band: (
        <>
          <span className="fair-certification-band-title">{row.title}</span>
          <span className="fair-certification-band-caption">{row.caption}</span>
        </>
      ),
    };
    for (const h of incomeHeaders) {
      const price = findPrice(row.prices, h.type);
      const original = price?.original;
      record[h.type] = original != null ? formatGbp(original) : '—';
    }
    return record;
  });

  const columns: ColumnsType<FeesRecord> = [
    {
      title: <span className="fair-certification-table-title-row">{config.title}</span>,
      align: 'center',
      children: config.headers.map((headerCell, idx) => {
        const isBand = idx === 0 || headerCell.type == null;
        return {
          title: (
            <Markdown className="fair-certification-pricing-header-md">{headerCell.name}</Markdown>
          ),
          dataIndex: (isBand ? 'band' : headerCell.type) as keyof FeesRecord,
          align: 'center' as const,
        };
      }),
    },
  ];

  return (
    <div className="fair-certification-pricing-table-responsive">
      <Table<FeesRecord>
        className="fair-certification-pricing-table"
        bordered
        pagination={false}
        size="middle"
        showSorterTooltip={false}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};
