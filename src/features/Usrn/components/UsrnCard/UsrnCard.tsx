import React from 'react';
import { FileTextFilled, InfoOutlined } from '@ant-design/icons';
import { Markdown, PercentBar } from '@oacore/core-ui';
import { formatNumber } from '@utils/helpers.ts';
import type { SupportStatusVariant, UsrnData } from '@features/Usrn/types/data.types';
import { getCardStatusConfig } from '@features/Usrn/utils/getCardStatusConfig';
import '../../style.css';

const DEFAULT_CTA_TEXT = 'Go to the toolkit';

type UsrnItemSubItem = {
  id: string;
  question: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  percentLabel?: string;
  counterLabel?: string;
  recomendation?: string;
};

export type UsrnItem = {
  id: string;
  title: string;
  description: string;
  linkUrl?: string;
  linkText?: string;
  titleLink?: string;
  items?: UsrnItemSubItem[];
};

type UsrnCardConfigParams = {
  rioxx: { partiallyCompliantCount?: number; totalCount?: number } | undefined;
  statistics: { countMetadata?: number } | undefined;
  internalStatistics: {
    fullTextCount?: number;
    metadataCount?: number;
    doiCount?: number;
  } | undefined;
  usrn: UsrnData | null;
  irus: unknown;
  rorId: string | null;
};

interface UsrnCardProps {
  item: UsrnItem;
  configParams: UsrnCardConfigParams;
}

export const UsrnCard: React.FC<UsrnCardProps> = ({ item, configParams }) => {
  const {
    rioxx,
    statistics,
    internalStatistics,
    usrn,
    irus,
    rorId,
  } = configParams;

  const displayCtaText = (item.linkText && item.linkText.length > 0)
    ? item.linkText
    : DEFAULT_CTA_TEXT;

  const hasSubItems = Boolean(item.items && item.items.length > 0);

  return (
    <div className="usrn-card">
      <div className="usrn-card__header card-info">
        <div className="card-info__header">
          <h3 className="card-info__title">
            {item.title}
          </h3>
        </div>
        <div className="card-info__content">
          <Markdown className="card-info__markdown">{item.description}</Markdown>
        </div>
        {item.linkUrl && (
          <div className="card-info__cta-wrap">
            <a
              className="card-info__cta"
              href={item.linkUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={displayCtaText}
            >
              <FileTextFilled className="card-info__cta-icon" />
              <span>{displayCtaText}</span>
            </a>
          </div>
        )}
      </div>

      {hasSubItems && (
        <div className="usrn-card__items">
          {item.items!.map((subItem) => {
            const config = getCardStatusConfig({
              cardId: subItem.id,
              rioxx: rioxx ?? undefined,
              statistics: statistics ?? undefined,
              internalStatistics: internalStatistics ?? undefined,
              usrn: usrn ?? null,
              irus,
              rorId,
            });

            const statusVariant: SupportStatusVariant = config.status || '';
            const hasLink = Boolean(subItem.linkUrl && subItem.linkText);
            const showPercentBar =
              config.countCovered != null &&
              config.countTotal != null &&
              config.countCovered > 0 &&
              config.countTotal > 0;

            return (
              <div
                key={subItem.id}
                className="support-status usrn-card__sub-item"
              >
                <div className="support-status__row">
                  <div className="support-status__question-wrap">
                    <h4 className="support-status__question">{subItem.question}</h4>
                  </div>
                  <span
                    className={`support-status__status support-status__status--${statusVariant || 'neutral'}`}
                  >
                    {config.status || '—'}
                  </span>
                </div>

                <div className="support-status__row">
                  <div className="support-status__description">
                    <Markdown>{subItem.description}</Markdown>
                    {hasLink && (
                      <>
                        {' '}
                        <a
                          href={subItem.linkUrl}
                          className="support-status__link"
                          target="_blank"
                          rel="noreferrer"
                          aria-label={subItem.linkText}
                        >
                          {subItem.linkText}
                        </a>
                      </>
                    )}
                  </div>
                  <span
                    className="support-status__status support-status__status--hidden"
                    aria-hidden
                  />
                </div>

                {config.countValue != null && subItem.counterLabel && (
                  <div className="support-status__counter">
                    <span className="support-status__counter-label">
                      {subItem.counterLabel}
                    </span>
                    <span className="support-status__counter-value">
                      {formatNumber(config.countValue)}
                    </span>
                  </div>
                )}

                {showPercentBar && subItem.percentLabel && (
                  <PercentBar
                    percentLabel={subItem.percentLabel}
                    countCovered={config.countCovered!}
                    countTotal={config.countTotal!}
                  />
                )}

                {subItem.recomendation && (
                  <div className="support-status__recommendation">
                    <InfoOutlined
                      className="support-status__recommendation-icon"
                      aria-hidden
                    />
                    <div className="support-status__recommendation-content">
                      <div className="support-status__recommendation-title">
                        Recommendation
                      </div>
                      <div className="support-status__recommendation-text">
                        <Markdown>{subItem.recomendation}</Markdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
