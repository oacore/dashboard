import React from 'react';
import { Tabs as AntdTabs } from 'antd';
import type { TabsProps } from 'antd';
import './styles.css';
import { CrPaper } from '@core/core-ui';
import { useResponsive } from '@hooks/useResponsive.ts';

export interface TabItem {
    key: string;
    label: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export interface CrTabsProps extends Omit<TabsProps, 'items'> {
    tabs: TabItem[];
    defaultActiveKey?: string;
    activeKey?: string;
    onChange?: (activeKey: string) => void;
    type?: 'line' | 'card' | 'editable-card';
    size?: 'large' | 'middle' | 'small';
    tabPlacement?: 'top' | 'end' | 'bottom' | 'start';
    centered?: boolean;
    animated?: boolean | { tabPane: boolean };
    className?: string;
    style?: React.CSSProperties;
}


export const CrTabs: React.FC<CrTabsProps> = ({
    tabs,
    defaultActiveKey,
    activeKey,
    onChange,
    type = 'card',
    size = 'middle',
    tabPlacement = 'top',
    centered = false,
    animated = true,
    ...restProps
}) => {
    const isMobile = useResponsive(768);

    const items = tabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        children: tab.children,
        disabled: tab.disabled,
    }));

    return (
        <CrPaper>
            <div className="tabs-container">
                <AntdTabs
                    className="custom-tabs"
                    tabBarStyle={{
                        justifyContent: isMobile ? 'stretch' : 'flex-end',
                        marginBottom: 0
                    }}
                    defaultActiveKey={defaultActiveKey || tabs[0]?.key}
                    activeKey={activeKey}
                    onChange={onChange}
                    type={type}
                    size={size}
                    tabPlacement={isMobile ? 'start' : tabPlacement}
                    centered={centered}
                    animated={animated}
                    items={items}
                    moreIcon={null}
                    {...restProps}
                />
            </div>
        </CrPaper>
    );
};
