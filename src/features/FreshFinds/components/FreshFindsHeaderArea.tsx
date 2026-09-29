import { useCallback } from 'react';
import { CrHeader, CrShowMore } from '@oacore/core-ui';

import { FreshFindsSettings } from './FreshFindsSettings';
import { articleTemplateData } from '../texts';

type FreshFindsHeaderAreaProps = {
  showSettings: boolean;
  setShowSettings: (next: boolean | ((previous: boolean) => boolean)) => void;
};

export const FreshFindsHeaderArea = ({ showSettings, setShowSettings }: FreshFindsHeaderAreaProps) => {
  const handleToggleSettings = useCallback(() => {
    setShowSettings((previous) => !previous);
  }, [setShowSettings]);

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
        <div className="fresh-finds-settings-panel" hidden={!showSettings}>
          <FreshFindsSettings />
        </div>
      </CrHeader>
    </div>
  );
};
