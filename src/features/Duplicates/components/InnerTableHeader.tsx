import React, { useState } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import type { DuplicateData } from '@features/Duplicates/types/data.types.ts';
import { TextData } from '@features/Duplicates/texts';
import BurgerMenu from '@/assets/icons/burgerMenu.svg';
import gamePad from '@/assets/icons/gamepad.svg';
import '../styles.css';
import { CrMessage } from '@core/core-ui';

interface InnerTableHeaderProps {
    onClick: () => void;
    rowData: DuplicateData;
}

export const InnerTableHeader: React.FC<InnerTableHeaderProps> = ({
    onClick,
    rowData,
}) => {
    const [visibleMenu, setVisibleMenu] = useState(false);

    const openLink = (key: string) => {
        if (key === 'coreUrl') {
            window.open(`https://core.ac.uk/works/${rowData.workId}`, '_blank');
            return;
        }
        if (key === 'outputUrl' && rowData.oai) {
            const idpUrl = import.meta.env.VITE_IDP_URL || 'https://api-dev.core.ac.uk';
            window.open(`${idpUrl}/oai/${rowData.oai}`, '_blank');
        }
    };

    const handleMenuClick = ({ key }: { key: string }) => {
        setVisibleMenu(false);
        openLink(key);
    };

    const menuItems: MenuProps['items'] = TextData.actions.map(({ title, key }) => ({
        key,
        label: title,
    }));


    return (
        <>
            <div className="more-header-wrapper">
                <Button
                    type="text"
                    onClick={onClick}
                    className="back-wrapper"
                >
                    <ArrowLeftOutlined />
                    <div className="go-back">Back</div>
                </Button>
            </div>
            <p className="inner-table-title">
                {TextData.moreInfoComparison.innerTableTitle}
            </p>
            <CrMessage alignItems="flex-start" variant="danger" className="compare-item">
                <img src={gamePad} alt="gamePad" />
                <p className={classNames('column-item')}>{rowData?.title}</p>
                <p className={classNames('column-item')}>
                    {rowData?.authors?.map((author) => author).join(' ') || '-'}
                </p>
                <p className={classNames('date-item')}>
                    {rowData?.publicationDate || '-'}
                </p>
                <div className="compare-item-actions">
                    <div className="visible-icon-wrapper">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            className="visible-icon"
                            onClick={() => openLink('coreUrl')}
                            aria-label="View in CORE"
                        />
                    </div>
                    <div className="action-button-wrapper">
                        <Dropdown
                            menu={{ items: menuItems, onClick: handleMenuClick }}
                            trigger={['click']}
                            placement="bottomRight"
                            open={visibleMenu}
                            onOpenChange={setVisibleMenu}
                        >
                            <Button
                                className="action-button-pure"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Open actions menu"
                            >
                                <img src={BurgerMenu} alt="Menu" />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </CrMessage>
        </>
    );
};
