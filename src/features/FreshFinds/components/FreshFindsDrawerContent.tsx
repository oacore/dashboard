import { CrDrawer } from '@components/common/CrDrawer/CrDrawer.tsx';

import type { FreshFindsRecord } from '../types/data.types';
import { formatAuthorAffiliationSummary } from '../utils/freshFindsAffiliations';
import { mapFreshFindsRecordToArticle } from '../utils/mapFreshFindsRecordToArticle';

import '../FreshFindsFeature.css';

const buildOutputsUrl = (doi: string | undefined): string => {
    const trimmed = doi?.trim() ?? '';
    if (trimmed === '') {
        return 'https://core.ac.uk/';
    }
    const slug = trimmed.replace(/^\s*https?:\/\/doi\.org\//i, '');
    return `https://doi.org/${encodeURIComponent(slug)}`;
};

type FreshFindsDrawerContentProps = {
    record: FreshFindsRecord;
    institutionLabel: string;
};

export const FreshFindsDrawerContent = ({ record, institutionLabel }: FreshFindsDrawerContentProps) => {
    const article = mapFreshFindsRecordToArticle(record);
    const outputsUrl = buildOutputsUrl(record.DOI != null ? String(record.DOI) : undefined);

    return (
        <div className="drawer-wrapper fresh-finds-drawer-wrapper">
            {institutionLabel !== '' && (
                <p className="fresh-finds-drawer__institution">{institutionLabel}</p>
            )}
            <CrDrawer
                article={article}
                isLoading={false}
                removeLiveActions
                hideRepositoryButton
                outputsUrl={outputsUrl}
            />
            {Array.isArray(record.affiliation_info) && record.affiliation_info.length > 0 && (
                <div className="fresh-finds-drawer-affiliations">
                    <h3 className="fresh-finds-drawer-affiliations__title">Affiliations by author</h3>
                    <ul className="fresh-finds-drawer__author-list">
                        {record.affiliation_info.map((info, index) => {
                            const name = info?.author_name != null ? String(info.author_name) : '—';
                            const affSummary = formatAuthorAffiliationSummary(info);
                            return (
                                <li key={`${name}-${index}`} className="fresh-finds-drawer__author-item">
                                    <span className="fresh-finds-drawer__author-name">{name}</span>
                                    {affSummary !== '' ? (
                                        <span className="fresh-finds-drawer__author-aff">{affSummary}</span>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};
