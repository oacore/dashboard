import { useCallback, useEffect } from 'react';
import { CrHeader, CrShowMore } from '@oacore/core-ui';

import { FreshFindsSettings } from './FreshFindsSettings';
import { useFreshFindsStore } from '../store/freshFindsStore';
import { articleTemplateData } from '../texts';

const SETTINGS_PANEL_ID = 'fresh-finds-settings-panel';

type FreshFindsHeaderAreaProps = {
  showSettings: boolean;
  setShowSettings: (next: boolean | ((previous: boolean) => boolean)) => void;
};

export const FreshFindsHeaderArea = ({ showSettings, setShowSettings }: FreshFindsHeaderAreaProps) => {
  const settingsAttentionRequestId = useFreshFindsStore((state) => state.settingsAttentionRequestId);

  const handleToggleSettings = useCallback(() => {
    setShowSettings((previous) => !previous);
  }, [setShowSettings]);

  useEffect(() => {
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
  }, [settingsAttentionRequestId, setShowSettings]);

  return (
    <div className="fresh-finds-header">
      <CrHeader
        identifier="BETA"
        title={articleTemplateData.title}
        showMore={<CrShowMore text={articleTemplateData.description} maxLetters={320} />}
        showSettingsIcon
        showSettings={showSettings}
        onSettingsToggle={handleToggleSettings}
      >
        <div id={SETTINGS_PANEL_ID} className="fresh-finds-settings-panel" hidden={!showSettings}>
          <FreshFindsSettings />
        </div>
      </CrHeader>
    </div>
  );
};
