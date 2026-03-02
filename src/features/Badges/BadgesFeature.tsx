import { useBadgesData } from './hooks/useBadgesData';
import { BadgeRow } from './components/BadgeRow';
import './style.css';
import {useRef} from "react";
import {CrPaper} from '@core/core-ui';


export function BadgesFeature() {
    const { data, loading, error } = useBadgesData();
    const tableRef = useRef<HTMLDivElement>(null)

    return (
      <CrPaper className="access-users-section">
        <div className="access-header-wrapper">
          <h2 className="header-wrapper-title">{data?.title ?? 'CORE badges'}</h2>
        </div>
        <div className="access-users-subtitle">{data?.descriptionDashboard ?? ''}</div>
        <div ref={tableRef} className="badgesContainer">
          {loading ? <div>Loading…</div> : null}
          {error ? <div className="badgesError">{error}</div> : null}

          {!loading && !error && data ? (
            <div className="badgesList">
              {(data.images ?? []).map((img) => (
                <BadgeRow
                  key={img.file}
                  imgUrl={img.file}
                  code={img?.source ?? ''}
                  isSquare={Boolean(img.source?.includes('square'))}
                />
              ))}
            </div>
          ) : null}
        </div>
      </CrPaper>
    );
}
