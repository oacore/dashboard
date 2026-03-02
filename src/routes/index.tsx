import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@components/Layout/DashboardLayout';
import { ProtectedRoute } from '@/guards/ProtectedRoute.tsx';
import { RestrictedRoute} from '@/guards/MetadataRestrictedRoute.tsx';
import { RootRedirect } from '@/guards/RootRedirect.tsx';
import { LoginPage } from '@/pages/Login';
import { ResetPage } from '@/pages/Reset';
import { CreatePasswordPage } from '@/pages/CreatePassword';
import { OrcidPage, OverviewPage, IndexingPage, ValidatorPage, DeduplicationPage, ContentPage, DepositCompliancePage, SdgPage, DasPage, RightsRetentionStrategyPage, ResearchSoftwarePage, DoiPage, UsrnPage, PluginsPage, PluginsDiscoveryPage, PluginsRecommenderPage, MembershipPage, SettingsPage } from '@/pages';
import { MembershipTypePage } from '@/pages/MembershipType';
import { DocumentationPage } from '@/pages/Documentation';
import { BadgesPage } from '@/pages/Badges';
import { OrganisationalPage } from '@/pages/Organisational';
import { RepositorySettingsPage } from '@/pages/RepositorySettings';
import { NotificationsPage } from '@/pages/Notifications';
export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/reset',
        element: <ResetPage />,
    },
    {
        path: '/reset/:token',
        element: <CreatePasswordPage />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <RootRedirect />
            </ProtectedRoute>
        ),
    },
    {
        path: '/data-providers/:dataProviderId',
        element: (
            <ProtectedRoute>
                <RestrictedRoute>
                    <DashboardLayout />
                </RestrictedRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="overview" replace />,
            },
            {
                path: 'overview',
                element: <OverviewPage />,
            },
            {
                path: 'indexing',
                element: <IndexingPage />,
            },
            {
                path: 'validator',
                element: <ValidatorPage />,
            },
            {
                path: 'deduplication',
                element: <DeduplicationPage />,
            },
            {
                path: 'content',
                element: <ContentPage />,
            },
            {
                path: 'deposit-compliance',
                element: <DepositCompliancePage />,
            },
            {
                path: 'usrn',
                element: (
                  <UsrnPage />
                ),
            },
            {
                path: 'sdg',
                element: <SdgPage />,
            },
            {
                path: 'das',
                element: <DasPage />,
            },
            {
                path: 'rights-retention-strategy',
                element: <RightsRetentionStrategyPage />,
            },
            {
                path: 'research-software',
                element: <ResearchSoftwarePage />,
            },
            {
                path: 'doi',
                element: <DoiPage />,
            },
            {
                path: 'orcid',
                element: <OrcidPage />,
            },
            {
                path: 'usrn',
                element: <UsrnPage />,
            },
            {
                path: 'plugins',
                element: <PluginsPage />,
            },
            {
                path: 'plugins/discovery',
                element: <PluginsDiscoveryPage />,
            },
            {
                path: 'plugins/recommender',
                element: <PluginsRecommenderPage />,
            },
            {
                path: 'membership',
                element: <MembershipPage />,
            },
            {
                path: 'membership-type',
                element: <MembershipTypePage />,
            },
            {
                path: 'documentation',
                element: <DocumentationPage />,
            },
            {
                path: 'badges',
                element: <BadgesPage />,
            },
            {
                path: 'settings',
                element: <SettingsPage />,
            },
            {
                path: 'organisational',
                element: <OrganisationalPage />,
            },
            {
                path: 'repository',
                element: <RepositorySettingsPage />,
            },
            {
                path: 'notifications',
                element: <NotificationsPage />,
            },
        ],
    },
]);
