import { useCallback, useEffect } from 'react';
import { CrHeader, CrShowMore } from '@oacore/core-ui';

import { FreshFindsSettings } from './FreshFindsSettings';
import { useIsSustainingPlan } from '../hooks/useIsSustainingPlan';
import { useFreshFindsStore } from '../store/freshFindsStore';
import { articleTemplateData } from '../texts';

const SETTINGS_PANEL_ID = 'fresh-finds-settings-panel';

type FreshFindsHeaderAreaProps = {
  showSettings: boolean;
  setShowSettings: (next: boolean | ((previous: boolean) => boolean)) => void;
};

export const FreshFindsHeaderArea = ({ showSettings, setShowSettings }: FreshFindsHeaderAreaProps) => {
  const { isSustainingPlan } = useIsSustainingPlan();
  const settingsAttentionRequestId = useFreshFindsStore((state) => state.settingsAttentionRequestId);
  const canOpenSettings = isSustainingPlan;

  const handleToggleSettings = useCallback(() => {
    if (!canOpenSettings) {
      return;
    }

    setShowSettings((previous) => !previous);
  }, [canOpenSettings, setShowSettings]);

  useEffect(() => {
    if (!canOpenSettings) {
      setShowSettings(false);
      return;
    }

    if (settingsAttentionRequestId === 0) {
      return;
    }

    setShowSettings(true);
    let innerFrame = 0;
    const frame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        document.getElementById(SETTINGS_PANEL_ID)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(innerFrame);
    };
  }, [canOpenSettings, settingsAttentionRequestId, setShowSettings]);

  return (
    <div className="fresh-finds-header">
      <CrHeader
        identifier="BETA"
        title={articleTemplateData.title}
        showMore={<CrShowMore text={articleTemplateData.description} maxLetters={320} />}
        showSettingsIcon={canOpenSettings}
        showSettings={canOpenSettings && showSettings}
        onSettingsToggle={canOpenSettings ? handleToggleSettings : undefined}
      >
        {canOpenSettings && (
          <div id={SETTINGS_PANEL_ID} className="fresh-finds-settings-panel" hidden={!showSettings}>
            <FreshFindsSettings />
          </div>
        )}
      </CrHeader>
    </div>
  );
};
