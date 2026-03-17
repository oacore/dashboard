import type { SwCounts, SwTab } from '@features/ResearchSoftware/types/sw.types'
import { TextData } from '@features/ResearchSoftware/texts'
import {
    WarningFilled
} from '@ant-design/icons'
import {CrStatsCard} from '@oacore/core-ui';

type Props = {
    counts?: SwCounts
    isLoading: boolean
    error?: Error | null
    notificationsEnabled: boolean
    onGoToSettings: () => void
    onReadyClick: () => void
    countKeyByTab: Record<SwTab, keyof SwCounts>
}

export const SwStats = ({
                            counts,
                            isLoading,
                            error,
                            notificationsEnabled,
                            onGoToSettings,
                            onReadyClick,
                            countKeyByTab,
                        }: Props) => {
    const disabledBox = (
        <div className="settings-description-wrapper settingsDescriptionSmall">
            <span className="cardIconWarning">
                <WarningFilled />
            </span>
            <div className="settingsDescriptionTextWrapper">
                <div className="settingsDescriptionText">
                    Your repository is not configured to support the automatic notification
                    of software mentions, please go to{' '}
                    <button type="button" className="clickAction" onClick={onGoToSettings}>
                        Settings
                    </button>{' '}
                    to activate it.
                </div>
            </div>
        </div>
    )

    return (
        <>
            <CrStatsCard
                title={TextData.statsCards.ready.title}
                description={TextData.statsCards.ready.description}
                count={counts?.ready_for_validation ?? 0}
                loading={isLoading}
                error={error}
                actionText={TextData.statsCards.ready.action}
                infoText={TextData.statsCards.ready.tooltip}
                onActionClick={onReadyClick}
                showInfo
                wholeWidthCard
                actionHref="#readySwTable"
            />
            {(['sent', 'responded'] as const).map((tab) => (
                <CrStatsCard
                    key={tab}
                    title={TextData.statsCards[tab].title}
                    description={TextData.statsCards[tab].description}
                    count={counts?.[countKeyByTab[tab]] ?? 0}
                    loading={isLoading}
                    error={error}
                    showInfo
                    infoText={TextData.statsCards[tab].tooltip}
                    wholeWidthCard
                    showAction={false}
                    tempDisabled={!notificationsEnabled ? disabledBox : false}
                />
            ))}
        </>
    )
}
