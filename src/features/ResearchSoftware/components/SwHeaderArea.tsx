import { useCallback, useRef } from 'react'
import { WarningFilled } from '@ant-design/icons'
import { Radio, Switch } from 'antd'

import { CrInput } from '@core/core-ui'
import { CrHeader } from '@core/core-ui';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore'
import Markdown from '@components/common/Markdown/Markdown.tsx'

import { TextData } from '@features/ResearchSoftware/texts'
import '@features/ResearchSoftware/style.css'

type SwHeaderAreaProps = {
    showSettings: boolean
    setShowSettings: (next: boolean | ((prev: boolean) => boolean)) => void
}

export const SwHeaderArea = ({ showSettings, setShowSettings }: SwHeaderAreaProps) => {
    const headerRef = useRef<HTMLDivElement>(null)

    const toggleSettings = useCallback(() => {
        setShowSettings((v) => !v)
    }, [setShowSettings])


    return (
        <div className="sw-headerArea" ref={headerRef}>
            <div className="sw-headerWrap">
                <CrHeader
                    title={TextData.title}
                    showMore={<CrShowMore text={TextData.description} maxLetters={320} />}
                    showSettingsIcon={true}
                    showSettings={showSettings}
                    onSettingsToggle={toggleSettings}
                >
                    {showSettings && (
                        <div className="sw-settingsPanel sw-settingsPanel-open">
                            <h3 className="sw-settingsTitle">{TextData.settings.title}</h3>

                            <div className="sw-settingsWarning">
                                <div className="sw-warnIcon cardIconWarning">
                                    <WarningFilled />
                                </div>
                                <div className="sw-warnText">
                                    <Markdown>{TextData.settings.warning}</Markdown>
                                </div>
                            </div>
                            <div className="sw-settingsForm">
                                <Markdown className="setting-sub-item">{TextData.settings.configure.title}</Markdown>
                                <CrInput
                                    className="sw-input"
                                    placeholder="https://yourrepository.url/endpoint"
                                    disabled
                                />
                                <div className="sw-toggleRow">
                                    <Switch disabled checked={false} />
                                    <span className="sw-toggleLabel">{TextData.settings.configure.description}</span>
                                </div>
                                <div className="radio-wrapper">
                                    <span>
                                        {TextData.settings.configure.subDescription}
                                    </span>
                                    <Radio.Group className="sw-radioGroup" disabled>
                                        {TextData.settings.configure.option.map((option) => (
                                            <Radio key={option.id} value={option.id}>
                                                {option.title}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </div>
                        </div>
                    )}
                </CrHeader>
            </div>
        </div>
    )
}
