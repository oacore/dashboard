import type { ReactNode } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Markdown } from '@oacore/core-ui';
import type { FairPricingHeader, FairPricingTable } from '../types/fairPricingTypes.ts';
import { findPrice, formatGbp } from '../hooks/fairPricingUtils.ts';

export type FairCertificationMembersFeesTableProps = {
  config: FairPricingTable;
};

type MembersRecord = {
  key: string;
  band: ReactNode;
  sustaining?: ReactNode;
} & Partial<Record<'low' | 'middle' | 'high', ReactNode>>;

export const FairCertificationMembersFeesTable = ({
  config,
}: FairCertificationMembersFeesTableProps) => {
  const sustainingHeader = config.headers.find((h) => h.type === 'sustaining');
  const supportingHeaders = config.headers.filter(
    (h): h is FairPricingHeader & { type: 'low' | 'middle' | 'high' } =>
      h.type === 'low' || h.type === 'middle' || h.type === 'high'
  );
  const bandHeader = config.headers[0];

  const dataSource: MembersRecord[] = config.certification.subRows.map((row) => {
    const record: MembersRecord = {
      key: row.title,
      band: (
        <>
          <span className="fair-certification-band-title">{row.title}</span>
          <span className="fair-certification-band-caption">{row.caption}</span>
        </>
      ),
    };
    for (const h of supportingHeaders) {
      const price = findPrice(row.prices, h.type);
      const discounted = price?.discounted;
      const original = price?.original;
      record[h.type] =
        discounted != null && original != null ? (
          <div className="fair-certification-price-stack">
            <span className="fair-certification-price-discounted">{formatGbp(discounted)}</span>
            <span className="fair-certification-price-struck">{formatGbp(original)}</span>
          </div>
        ) : (
          '—'
        );
    }
    if (sustainingHeader) {
      record.sustaining = findPrice(row.prices, 'sustaining')?.free ? (
        <strong className="fair-certification-price-free">Free</strong>
      ) : (
        '—'
      );
    }
    return record;
  });

  const secondRowChildren: ColumnsType<MembersRecord> = [
    {
      title: '\u00a0',
      align: 'center',
      children: [
        {
          title: bandHeader ? (
            <Markdown className="fair-certification-pricing-header-md">{bandHeader.name}</Markdown>
          ) : null,
          dataIndex: 'band',
          align: 'center',
        },
      ],
    },
    {
      title: 'Supporting',
      align: 'center',
      children: supportingHeaders.map((h) => ({
        title: <Markdown className="fair-certification-pricing-header-md">{h.name}</Markdown>,
        dataIndex: h.type,
        align: 'center' as const,
      })),
    },
  ];

  if (sustainingHeader) {
    secondRowChildren.push({
      title: sustainingHeader.name,
      align: 'center',
      children: [
        {
          title: <span className="fair-certification-pricing-th-empty" aria-hidden />,
          dataIndex: 'sustaining',
          align: 'center' as const,
          className: 'fair-certification-pricing-td--sustaining',
        },
      ],
    });
  }

  const columns: ColumnsType<MembersRecord> = [
    {
      title: <span className="fair-certification-table-title-row">{config.title}</span>,
      align: 'center',
      children: secondRowChildren,
    },
  ];

  return (
    <div className="fair-certification-pricing-table-responsive">
      <Table<MembersRecord>
        className="fair-certification-pricing-table fair-certification-pricing-table--members"
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
