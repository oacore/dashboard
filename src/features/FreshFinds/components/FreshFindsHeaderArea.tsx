import { useCallback, useEffect, useRef } from 'react';
import { CrHeader, CrShowMore } from '@oacore/core-ui';

import { FreshFindsSettings } from './FreshFindsSettings';
import { useFreshFindsStore } from '../store/freshFindsStore';
import { articleTemplateData } from '../texts';

export const FRESH_FINDS_SETTINGS_PANEL_ID = 'fresh-finds-settings-panel';

type FreshFindsHeaderAreaProps = {
  showSettings: boolean;
  setShowSettings: (next: boolean | ((previous: boolean) => boolean)) => void;
};

export const FreshFindsHeaderArea = ({ showSettings, setShowSettings }: FreshFindsHeaderAreaProps) => {
  const settingsAttentionRequestId = useFreshFindsStore((state) => state.settingsAttentionRequestId);
  const shouldScrollToSettingsRef = useRef(false);

  const handleToggleSettings = useCallback(() => {
    setShowSettings((previous) => !previous);
  }, [setShowSettings]);

  useEffect(() => {
    if (settingsAttentionRequestId === 0) {
      return;
    }

    shouldScrollToSettingsRef.current = true;
    setShowSettings(true);
  }, [settingsAttentionRequestId, setShowSettings]);

  useEffect(() => {
    if (!showSettings || !shouldScrollToSettingsRef.current) {
      return;
    }

    shouldScrollToSettingsRef.current = false;
    const settingsPanel = document.getElementById(FRESH_FINDS_SETTINGS_PANEL_ID);
    settingsPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    settingsPanel?.focus({ preventScroll: true });
  }, [settingsAttentionRequestId, showSettings]);

  return (
    <div className="fresh-finds-header">
      <CrHeader
        identifier="Demo"
        title={articleTemplateData.title}
        showMore={<CrShowMore text={articleTemplateData.description} maxLetters={320} />}
        showSettingsIcon
        showSettings={showSettings}
        onSettingsToggle={handleToggleSettings}
      >
        <div
          id={FRESH_FINDS_SETTINGS_PANEL_ID}
          className="fresh-finds-settings-panel"
          hidden={!showSettings}
          tabIndex={-1}
        >
          <FreshFindsSettings />
        </div>
      </CrHeader>
    </div>
  );
};
