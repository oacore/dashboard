import type { DrawerConfig } from '../../types.ts';

interface BuildExpandableConfigProps<T> {
    drawer?: DrawerConfig<T>;
    expandedRowKey: string | null;
    rowKey: string | ((record: T) => string);
    setExpandedRowKey: (key: string | null) => void;
    setSelectedRecord: (record: T | null) => void;
}

export const CrExpandableRowConfig = <T = unknown>({
    drawer,
    expandedRowKey,
    rowKey,
    setExpandedRowKey,
    setSelectedRecord,
}: BuildExpandableConfigProps<T>) => {
    if (!drawer?.enabled) return undefined;

    return {
        expandedRowRender: (record: T) => (
            <div>
                {drawer.content(record)}
            </div>
        ),
        expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
        onExpand: (expanded: boolean, record: T) => {
            const recordKey = typeof rowKey === 'function' ? rowKey(record) : String((record as Record<string, unknown>)[rowKey]);
            setExpandedRowKey(expanded ? recordKey : null);
            if (!expanded) setSelectedRecord(null);
        },
        expandIcon: () => null,
        expandRowByClick: true,
    };
};
