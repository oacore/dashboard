import { Badge, Layout, Menu, theme, Typography, Select, Spin } from 'antd';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CloseOutlined, FolderOutlined } from '@ant-design/icons';
import { MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { menuItems, DISABLED_TABS_WHEN_NO_METADATA } from './menuItems';
import { useDashboardRoute } from '@hooks/useDashboardRoute';
import { DEFAULT_DASHBOARD_PATH } from '@/utils/routes';
import RepositorySelect from '../common/RepositorySelect/RepositorySelect';
import { useDataProviderStore } from '@/store/dataProviderStore';
import DataProviderLogo from '@components/common/DataProviderLogo/DataProviderLogo.tsx';
import { useDataProviderStatistics } from '@hooks/useDataProviderStatistics';
import { useDoiStatistics } from '@features/Doi/hooks/useDoiStatistics.ts';

// Import all icons
import viewDashboardIcon from '@/assets/icons/view-dashboard.svg';
import syncIcon from '@/assets/icons/sync.svg';
import metadataValidatorIcon from '@/assets/icons/metadata-validator.svg';
import deduplicationIcon from '@/assets/icons/deduplication.svg';
import fileDocumentIcon from '@/assets/icons/file-document.svg';
import calendarCheckIcon from '@/assets/icons/calendar-check.svg';
import sdgIcon from '@/assets/icons/sdg.svg';
import dasIcon from '@/assets/icons/das.svg';
import copyDocumentIcon from '@/assets/icons/copy-document.svg';
import swIcon from '@/assets/icons/sw.svg';
import barcodeIcon from '@/assets/icons/barcode.svg';
import orcidIcon from '@/assets/icons/orcid.svg';
import fileCheckIcon from '@/assets/icons/file-check.svg';
import puzzleIcon from '@/assets/icons/puzzle.svg';
import accountGroupIcon from '@/assets/icons/account-group.svg';
import cogIcon from '@/assets/icons/cog.svg';
import imagePlaceholder from '@/assets/icons/imagePlaceholder.svg';
import coreSymbol from '@/assets/icons/core-symbol.svg';
import repositoryIcon from '@/assets/icons/repositoryIcon.svg';
import enrichment from '@/assets/icons/enrichment.svg';
import { useDashboardDataProviderSync } from '@hooks/useDashboardDataProviderSync';
import { useCurrentUser } from '@hooks/useUser';
import DashboardGuide from '@features/DashboardGuide/DashboardGuide';
import { useTutorialStore } from '@features/DashboardGuide/store/tutorialStore.ts';
import './styles.css';
import { NotificationGuide } from '@features/NotificationGuide/NotificationGuide.tsx';
import { useNotificationGuide } from '@features/NotificationGuide/hooks/useNotificationGuide';
import { BellOutlined } from '@ant-design/icons';
import { NotificationPopover } from '@components/common/NotificationPopover/NotificationPopover';
import { useNotification } from '@hooks/useNotification';
import { useOaiMapping } from '@features/Settings/RepositorySettings/hooks/useOaiMapping';
import { useSets, type SetItem } from '@features/Settings/RepositorySettings/hooks/useSets';
import { usePluginConfig } from '@features/Plugins/hooks/usePluginConfig';
import { useOrganisation } from '@features/Settings/OrganisationalSettings/hooks/useOrganisation';
import { FeedbackButton } from '@components/common/FeedbackButton/FeedbackButton';
import { useHarvestingStatus } from '@features/indexing/hooks/useHarvestingStatus';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// Icon mapping
const iconMap: Record<string, string> = {
    'view-dashboard': viewDashboardIcon,
    'sync': syncIcon,
    'metadata-validator': metadataValidatorIcon,
    'deduplication': deduplicationIcon,
    'file-document': fileDocumentIcon,
    'calendar-check': calendarCheckIcon,
    'sdg': sdgIcon,
    'das': dasIcon,
    'copy-document': copyDocumentIcon,
    'sw': swIcon,
    'barcode': barcodeIcon,
    'orcid': orcidIcon,
    'file-check': fileCheckIcon,
    'puzzle': puzzleIcon,
    'account-group': accountGroupIcon,
    'cog': cogIcon,
    'enrichment': enrichment,
};

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const { buildPath, currentSubPath } = useDashboardRoute();
    const { user, logout } = useAuthStore();
    const {
        selectedDataProvider,
        setSelectedDataProvider,
        setSelectedSetSpec,
        selectedSetSpec,
    } = useDataProviderStore();

    const { statistics, error: statisticsError } = useDataProviderStatistics(
        selectedDataProvider?.id ?? null,
        selectedSetSpec
    );

    const {
        harvestingStatus,
        harvestingError,
    } = useHarvestingStatus(
        false,
        selectedDataProvider?.id ?? undefined
    );

    const hasHarvestingData = harvestingStatus != null && !harvestingError;
    const hasStatisticsData = statistics != null && !statisticsError;
    const shouldDisableTabs =
        (hasHarvestingData && harvestingStatus?.lastHarvestingDate == null) ||
        (hasStatisticsData && statistics?.countMetadata == null);

    useCurrentUser();

    const { dataProviders: storeDataProviders, isLoading, isError } = useDashboardDataProviderSync(user?.id || null);

    // Fetch organisation data after data providers are loaded
    useOrganisation({ enabled: !isLoading && !isError });

    // Fetch OAI mapping data after data providers are loaded
    useOaiMapping();

    // Fetch plugin config (Discovery/Recommender keys) for the selected data provider
    usePluginConfig();

    const {
        enabledList,
        loadingSets,
    } = useSets();

    const [headerSelectedSet, setHeaderSelectedSet] = useState<SetItem | null>(null);

    const getSetValue = useCallback((item: SetItem) => {
        if (item?.id != null) return item.id.toString();
        if (item?.setSpec) return `spec:${item.setSpec}`;
        return '';
    }, []);

    const handleHeaderSetChange = useCallback((value: string | null) => {
        if (!value) {
            setHeaderSelectedSet(null);
            setSelectedSetSpec(null);
            return;
        }
        const item = enabledList.find(
            (s) => getSetValue(s) === value
        );
        setHeaderSelectedSet(item ?? null);
        setSelectedSetSpec(item?.setSpec ?? null);
    }, [enabledList, getSetValue, setSelectedSetSpec]);

    const handleHeaderSetClear = useCallback(() => {
        setHeaderSelectedSet(null);
        setSelectedSetSpec(null);
    }, [setSelectedSetSpec]);

    useEffect(() => {
        setSelectedSetSpec(null);
        setHeaderSelectedSet(null);
    }, [selectedDataProvider?.id, setSelectedSetSpec]);

    const { openModal } = useTutorialStore();
    const { handleButtonClose, handleButtonClick } = useNotificationGuide(isLoading, isError);

    // Fetch notifications - only after data providers are loaded
    const {
        notifications,
        isLoading: isNotificationsLoading,
        markNotificationAsRead,
    } = useNotification({
        userId: user?.id || null,
        enabled: !isLoading && !isError,
    });

    // Fetch statistics for the selected data provider
    useDataProviderStatistics(
        selectedDataProvider?.id || null,
        selectedSetSpec
    );
    useDoiStatistics(selectedDataProvider?.id || null, selectedSetSpec);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close mobile menu when screen size changes
    useEffect(() => {
        if (!isMobile) {
            setMobileOpen(false);
        }
    }, [isMobile]);

    const isTabDisabled = (path: string) =>
        shouldDisableTabs && DISABLED_TABS_WHEN_NO_METADATA.includes(path);

    // Convert config to menu items
    const navItems = [
        ...menuItems.map((route) => {
            const iconSrc = iconMap[route.icon];

            if (route.children) {
                return {
                    key: route.path,
                    icon: iconSrc ? <img alt="" src={iconSrc} className="dashboard-sider-menu-icon" /> : null,
                    label: route.label,
                    className: route.path === 'settings' ? 'setting-item-wrapper' : undefined,
                    disabled: isTabDisabled(route.path),
                    children: route.children.map((child) => ({
                        key: child.path,
                        label: child.label,
                        disabled: isTabDisabled(child.path),
                    })),
                };
            }
            return {
                key: route.path,
                icon: iconSrc ? <img alt="" src={iconSrc} className="dashboard-sider-menu-icon" /> : null,
                label: route.label,
                className: route.path === 'settings' ? 'setting-item-wrapper' : undefined,
                disabled: isTabDisabled(route.path),
            };
        }),
        {
            key: 'start-tutorial',
            icon: <PlayCircleOutlined className="dashboard-sider-menu-tutorial-icon" />,
            label: <span className="dashboard-sider-menu-tutorial-label">Start tutorial</span>,
            className: 'tutorial-menu-item',
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'start-tutorial') {
            openModal();
            if (isMobile) {
                setMobileOpen(false);
            }
            return;
        }

        if (isTabDisabled(key)) return;

        if (isMobile) {
            setMobileOpen(false);
        }
        if (selectedDataProvider?.id) {
            navigate(buildPath(key));
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNotificationClick = async (
        userID: string,
        notificationId: string | 'all',
        dataProviderId?: number
    ) => {
        if (!user?.id || userID !== user.id) return;

        try {
            if (notificationId === 'all') {
                await markNotificationAsRead('all');
            } else {
                await markNotificationAsRead(notificationId);
                if (dataProviderId) {
                    navigate(buildPath('indexing'));
                }
            }
        } catch (err) {
            console.error('Error handling notification click:', err);
        }
    };


    const getSelectedKey = () => {
        const subPath = currentSubPath;
        if (!subPath) return DEFAULT_DASHBOARD_PATH;

        // Check if current path matches any child route
        const nestedRoute = menuItems
            .filter((item) => item.children)
            .flatMap((item) =>
                item.children!.map((child) => ({
                    childPath: child.path,
                }))
            )
            .find(
                (route) =>
                    subPath === route.childPath || subPath.startsWith(`${route.childPath}/`)
            );

        if (nestedRoute) {
            return nestedRoute.childPath;
        }
        // For top-level items with subpaths (e.g. plugins/discovery -> plugins)
        const topLevelMatch = menuItems.find(
            (item) =>
                !item.children &&
                (subPath === item.path || subPath.startsWith(`${item.path}/`))
        );
        if (topLevelMatch) {
            return topLevelMatch.path;
        }
        return subPath;
    };

    const handleLogoClick = () => {
        if (selectedDataProvider?.id) {
            navigate(buildPath('repository') + '?referrer=upload');
        }
    };

    // Show up to 10 notifications in the popover (or all if less than 10)
    const displayedNotifications = useMemo(
        () => notifications.slice(0, Math.min(10, notifications.length)),
        [notifications]
    );

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n?.readStatus).length,
        [notifications]
    );



    return (
        <Layout className="dashboard-layout">
            {/* Global Progress Bar - Always visible at top when loading */}
            {isLoading && (
                <div className="global-progress-bar-container">
                    <div className="global-progress-bar" />
                </div>
            )}
            <Header
                className="dashboard-header"
                style={{ background: colorBgContainer }}
            >
                {isMobile && (
                    <div
                        className="mobile-menu-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                )}
                <div className="header-logo-wrapper">
                    <img src={coreSymbol} alt="coreSymbol" />
                    <div className="dashboard-header-title">
                        Dashboard
                    </div>
                </div>
                <div className="header-select-wrapper">
                    <div className="select-wrapper">
                        <img
                            className="repository-logo"
                            src={repositoryIcon}
                            alt="repositoryIcon"
                        />
                        <RepositorySelect
                            dataProviders={storeDataProviders}
                            isLoading={isLoading}
                            selectedDataProvider={selectedDataProvider}
                            onSelectChange={(provider) => {
                                setSelectedDataProvider(provider);
                                if (provider?.id) {
                                    navigate(
                                        buildPath(
                                            currentSubPath || DEFAULT_DASHBOARD_PATH,
                                            provider.id
                                        )
                                    );
                                }
                            }}
                        />
                    </div>
                    {enabledList.length > 0 && selectedDataProvider?.id === 140 && (
                        <div className="header-sets-select-wrapper">
                            <FolderOutlined className="folder-icon" />
                            {headerSelectedSet ? (
                                <div className="selected-item">
                                    <span>
                                        {(headerSelectedSet.setNameDisplay ?? headerSelectedSet.setName ?? headerSelectedSet.setSpec ?? '').length > 30
                                            ? `${(headerSelectedSet.setNameDisplay ?? headerSelectedSet.setName ?? headerSelectedSet.setSpec).substring(0, 30)}...`
                                            : headerSelectedSet.setNameDisplay ?? headerSelectedSet.setName ?? headerSelectedSet.setSpec}
                                    </span>
                                    <CloseOutlined
                                        className="close-icon"
                                        onClick={handleHeaderSetClear}
                                        aria-label="Clear set selection"
                                    />
                                </div>
                            ) : (
                                <div className="container">
                                    <Select
                                        id="sets"
                                        className="repository-select"
                                        showSearch
                                        placeholder="Sets"
                                        value={undefined}
                                        onChange={handleHeaderSetChange}
                                        options={enabledList
                                            .filter((item) => item && (item.id != null || item.setSpec))
                                            .map((item) => ({
                                                label: item.setNameDisplay ?? item.setName ?? item.setSpec ?? '-',
                                                value: getSetValue(item),
                                            }))}
                                        loading={loadingSets}
                                        notFoundContent={
                                            loadingSets ? (
                                                <Spin size="small" />
                                            ) : (
                                                'No sets found'
                                            )
                                        }
                                        aria-label="Select set"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="bell-wrapper">
                    <NotificationPopover
                        notifications={notifications}
                        displayedNotifications={displayedNotifications}
                        isLoading={isNotificationsLoading}
                        handleNotificationClick={handleNotificationClick}
                        userID={user?.id}
                        hasUnreadNotifications={unreadCount > 0}
                    >
                        <Badge className="count" count={unreadCount}>
                            <BellOutlined className="bell-icon" />
                        </Badge>
                    </NotificationPopover>
                </div>
                <div className="header-user-menu">
                    <span className="user-name">{user?.email}</span>
                    <div
                        className="log-out"
                        role="button"
                        tabIndex={0}
                        onClick={handleLogout}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleLogout();
                            }
                        }}
                        aria-label="Log out"
                    >
                        Logout
                    </div>
                </div>
            </Header>
            {!isLoading && !isError ? (
                <Layout className="dashboard-main-layout">
                    <Sider
                        width={225}
                        collapsible={false}
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                        className={`dashboard-sider ${mobileOpen ? 'mobile-open' : ''}`}
                    >
                        <>
                            <div
                                className="logo-wrapper"
                                onClick={handleLogoClick}
                            >
                                {selectedDataProvider?.logo ? (
                                    <DataProviderLogo
                                        size="ml"
                                        imageSrc={selectedDataProvider.logo}
                                        alt={selectedDataProvider.name}
                                    />
                                ) : (
                                    <img
                                        className="repository-logo-big"
                                        src={imagePlaceholder}
                                        alt={selectedDataProvider?.name || ''}
                                    />
                                )}
                            </div>

                            {selectedDataProvider?.institution ? (
                                <p className="institution">
                                    <Text
                                        ellipsis={{
                                            tooltip: selectedDataProvider?.institution,
                                        }}
                                    >
                                        {selectedDataProvider?.institution}
                                    </Text>
                                </p>
                            ) : (
                                ' '
                            )}
                        </>
                        <Menu
                            mode="inline"
                            selectedKeys={[getSelectedKey()]}
                            className="dashboard-sider-menu"
                            items={navItems}
                            onClick={handleMenuClick}
                        />
                    </Sider>

                    <Layout className={`dashboard-content-layout ${collapsed ? 'collapsed' : ''}`}>
                        <Content className="dashboard-content">
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            ) : isError ? (
                <Content className="dashboard-content">
                    <div className="error-view">
                        <Text>Failed to load data. Please refresh the page.</Text>
                    </div>
                </Content>
            ) : null}
            <DashboardGuide />
            <NotificationGuide
                handleButtonClick={handleButtonClick}
                handleButtonClose={handleButtonClose}
            />
            {user && (
                <FeedbackButton
                    user={user}
                    dataProvider={selectedDataProvider}
                />
            )}
        </Layout>
    );
}
