import type { ReactNode } from 'react'

import type { SwRow } from '@features/ResearchSoftware/types/sw.types'
import type { ReusableTableColumn } from '@components/common/CrTable/types'

export const createSwColumns = (): ReusableTableColumn<SwRow>[] => [
    {
        key: 'oai',
        title: 'OAI',
        dataIndex: 'oai',
        sortable: true,
        align: 'center',
        className: 'oai-column',
        render: (value: unknown): ReactNode => {
            if (typeof value !== 'string') return '-'

            return <div className="">{value.split(':').pop() || value}</div>
        },
    },
    {
        key: 'title',
        title: 'Title',
        dataIndex: 'title',
        sortable: true,
        align: 'left',
        render: (value: unknown): ReactNode => (
            <div className="overflow-text">{typeof value === 'string' ? value : '-'}</div>
        ),
    },
    {
        key: 'authors',
        title: 'Authors',
        dataIndex: 'authors',
        sortable: false,
        align: 'left',
        render: (value: unknown): ReactNode => {
            if (Array.isArray(value)) {
                return <div className="overflow-text">{value.join(', ')}</div>
            }
            if (typeof value === 'string') {
                return <div className="overflow-text">{value}</div>
            }
            return '-'
        },
    },
    {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        sortable: false,
        align: 'center',
        render: (): ReactNode => <span className="sw-status-ready">Ready to be sent</span>,
    },
]
