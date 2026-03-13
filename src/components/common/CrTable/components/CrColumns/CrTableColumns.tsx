import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CrSortIcon } from '@components/common/CrTable/components/CrSort/CrSort.tsx';
import BurgerMenu from '../../../../../assets/icons/burgerMenu.svg';
import type { ReusableTableColumn } from '../../types.ts';

interface BuildTableColumnsProps<T> {
    columns: ReusableTableColumn<T>[];
    sortable: boolean;
    sortField?: string;
    sortOrder: 'asc' | 'desc' | null;
    showSortIcon: boolean;
    getActionMenuItems: (record: T) => MenuProps['items'];
}

export const CrTableColumns = <T = unknown>({
    columns,
    sortable,
    sortField,
    sortOrder,
    showSortIcon,
    getActionMenuItems,
}: BuildTableColumnsProps<T>): ColumnsType<T> => {
    const cols: ColumnsType<T> = columns.map(col => {
        const isSortable = col.sortable || sortable;

        return {
            key: col.key,
            title: col.title,
            dataIndex: col.dataIndex || col.key,
            width: col.width,
            align: col.align,
            // Custom sorter that prevents the default three-state cycle
            sorter: col.sorter !== undefined ? col.sorter : isSortable ? {
                multiple: 0,
                compare: () => 0, // handle sorting server-side
            } : false,
            sortOrder:
                sortField === col.key
                    ? sortOrder === 'asc'
                        ? 'ascend'
                        : sortOrder === 'desc'
                            ? 'descend'
                            : undefined
                    : undefined,
            showSorterTooltip: false,
            // Override the default sort directions to only include asc and desc
            sortDirections: isSortable ? ['ascend', 'descend'] : undefined,
            sortIcon:
                isSortable && (col.showSortIcon || showSortIcon)
                    ? () => {
                        const currentSortOrder =
                            sortField === col.key
                                ? sortOrder === 'asc'
                                    ? 'ascend'
                                    : sortOrder === 'desc'
                                        ? 'descend'
                                        : undefined
                                : undefined;
                        return <CrSortIcon sortOrder={currentSortOrder} />;
                    }
                    : () => null,
            render: col.render,
        };
    });

    cols.push({
        key: 'actions',
        title: '',
        align: 'right',
        width: 56,
        className: 'cr-table-actions-column',
        render: (_, record) => {
            const menuItems = getActionMenuItems(record);
            if (!menuItems || menuItems.length === 0) return null;
            return (
                <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<img src={BurgerMenu} alt="" />}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Dropdown>
                </div>
            );
        },
    });

    return cols;
};
