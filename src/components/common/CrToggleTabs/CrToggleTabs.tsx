import { Tabs } from 'antd';
import './styles.css';

export interface CrToggleTabsProps {
    activeKey: string;
    onChange: (key: string) => void;
    items: Array<{
        key: string;
        label: string;
    }>;
    className?: string;
}

export const CrToggleTabs: React.FC<CrToggleTabsProps> = ({
    activeKey,
    onChange,
    items,
    className = '',
}) => {
    const handleChange = (key: string) => {
        onChange(key);
    };

    return (
        <div className={`cr-toggle-tabs ${className}`}>
            <Tabs
                activeKey={activeKey}
                onChange={handleChange}
                items={items}
                type="card"
                size="small"
            />
        </div>
    );
};
