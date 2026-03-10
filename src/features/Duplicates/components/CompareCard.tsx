import React, { useState, useEffect, useRef } from 'react';
import { useWindowWidth } from '@hooks/useScrollView.ts';
import { Carousel, Button, Tooltip } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { EyeOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { CrMessage, Markdown, InfoTooltip } from '@core/core-ui';
import { CrShowMore } from '@components/common/CrShowMore/CrShowMore.tsx';
import { useWorkData } from '@features/Duplicates/hooks/useWorkData.ts';
import { useMultipleOutputs } from '@features/Duplicates/hooks/useMultipleOutputs.ts';
import { TextData } from '@features/Duplicates/texts';
import TogglePanel from './TogglePanel.tsx';
import ActionModal from './ActionModal.tsx';
import type { DuplicateData } from '@features/Duplicates/types/data.types.ts';
import info from '@/assets/icons/info.svg';
import arrowLeft from '@/assets/icons/carouselArrowLeft.svg';
import arrowRight from '@/assets/icons/carouselArrowRight.svg';
import tickGreen from '@/assets/icons/tickGreen.svg';
import dropArrow from '@/assets/icons/drop-arrow.svg';
import '../styles.css';

const VERSION_TYPES = ['AO', 'SMUR', 'AM', 'P', 'VoR', 'CVoR', 'EVoR', 'NA', '(N/A)'];

interface CompareCardProps {
    workId?: string | number;
    documentIds: (string | number | undefined)[];
    duplicateData?: DuplicateData;
    updateWork?: (workId: string | number, outputId: string | number, type: string) => Promise<void>;
    outputIdToApiType?: Record<string, string>;
}

const generatedTitle = [
    <div key="metadata" className="metadata-title">Metadata title</div>,
    <div key="main" className="main-title">Title</div>,
    <div key="author" className="author-title">Author</div>,
    <div key="type" className="column-item-title">Type</div>,
    <div key="field" className="column-item-title">Field of study</div>,
    <div key="doi" className="column-item-title">DOI</div>,
    <div key="pubDate">Publication date</div>,
    <div key="depDate">Deposited date</div>,
    <div key="abstract" className="abstract-title">Abstract</div>,
    <div key="version">Version</div>,
    <div key="action">Action</div>,
];

const findTitlesBySelectedTypes = (
    data: Array<{ title?: string; type?: string }>,
    singleType: string
): string => {
    const match = data.find((item) => item.type === singleType);
    const title = match?.title || '';
    return title.length > 35 ? `${title.slice(0, 35)}...` : title;
};

const isVersionType = (type?: string): boolean =>
    !!type && VERSION_TYPES.includes(type);

export const CompareCard: React.FC<CompareCardProps> = ({
    workId,
    documentIds,
    updateWork,
    outputIdToApiType = {},
}) => {
    const [modifiedWorksData, setModifiedWorksData] = useState<(string | undefined)[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentModalData, setCurrentModalData] = useState<{
        title: string;
        type: string;
        description: string;
        confirm: string;
        cancel: string;
        id?: string | number;
    } | null>(null);
    const carouselRef = useRef<CarouselRef | null>(null);
    const windowWidth = useWindowWidth();
    const slidesToShow = windowWidth <= 768 ? 1 : 2;

    const { workData, isLoading } = useWorkData(workId);
    const { outputs } = useMultipleOutputs(documentIds);

    const modalContent = TextData.comparison.modalData;

    const handleModalOpen = (id: string | number, index: number) => {
        const clickedItem = outputsData.find((item) => item.data?.id === id);
        const outputId = String(id);
        const apiType = outputIdToApiType[outputId];
        const isItemSelected = apiType === modalContent[index]?.type;
        if (isItemSelected && modalContent[index + 2]) {
            setCurrentModalData({
                ...modalContent[index + 2],
                id: clickedItem?.data?.id,
            });
        } else {
            setCurrentModalData({ ...modalContent[index], id: clickedItem?.data?.id });
        }
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    };

    const handleModalClose = () => {
        setCurrentModalData(null);
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
    };

    const handleModalConfirm = async (modalData: { id?: string | number; type: string }) => {
        handleModalClose();
        if (!modalData.id || !workId) return;
        if (updateWork) {
            await updateWork(workId, modalData.id, modalData.type);
        }
    };

    const handleTypeSave = async (outputId: string | number, type: string) => {
        if (!workId || !updateWork) return;
        const apiType = outputIdToApiType[String(outputId)];
        const isSelected = apiType === type;
        const newType = isSelected ? '' : type;
        await updateWork(workId, outputId, newType);
    };

    useEffect(() => {
        if (!workData) return;

        const generatedData = [
            (workData as { authors?: Array<{ name?: string }> })?.authors?.map((author) => author.name).join(', '),
            (workData as { documentType?: string })?.documentType,
            (workData as { fieldOfStudy?: string })?.fieldOfStudy,
            (workData as { doi?: string })?.doi,
            (workData as { publishedDate?: string })?.publishedDate,
            (workData as { depositedDate?: string })?.depositedDate,
            (workData as { abstract?: string })?.abstract,
        ];

        setModifiedWorksData(generatedData);
    }, [workData]);

    const handleWorksRedirect = (id?: string | number) => {
        if (!id) return;
        window.open(`https://core.ac.uk/works/${id}`, '_blank');
    };

    const handleOutputsRedirect = (id?: string | number) => {
        if (!id) return;
        window.open(`https://core.ac.uk/outputs/${id}`, '_blank');
    };

    const handleRepositoryRedirect = (oaiId?: string) => {
        if (!oaiId) return;
        const idpUrl = import.meta.env.VITE_IDP_URL || 'https://api-dev.core.ac.uk';
        window.open(`${idpUrl}/oai/${oaiId}`, '_blank');
    };

    const handlePrev = () => {
        carouselRef.current?.prev();
    };

    const handleNext = () => {
        carouselRef.current?.next();
    };

    const handleSlideChange = (current: number) => {
        setCurrentSlide(current);
    };

    const compareNames = (string?: string, index?: number) => {
        if (index === undefined || !modifiedWorksData[index]) return true;

        const getSortedNames = (str?: string) =>
            str
                ?.split(',')
                .map((name) => name.trim().toLowerCase())
                .sort() || [];

        const sortedNames1 = getSortedNames(string);
        const sortedNames2 = getSortedNames(modifiedWorksData[index] as string);

        return JSON.stringify(sortedNames1) === JSON.stringify(sortedNames2);
    };

    const isMatching = (value: unknown, arrayIndex: number) => {
        const worksValue = modifiedWorksData[arrayIndex];

        if (!value && !worksValue) return true;
        if (!value || !worksValue) return false;

        const valueStr = Array.isArray(value)
            ? value.join(', ').toLowerCase()
            : String(value || '').toLowerCase();

        const compareStr = Array.isArray(worksValue)
            ? worksValue.join(', ').toLowerCase()
            : String(worksValue || '').toLowerCase();

        if (arrayIndex === 4 || arrayIndex === 5) {
            return valueStr === compareStr;
        }

        return valueStr && compareStr && (compareStr.includes(valueStr) || valueStr.includes(compareStr));
    };


    const workDataTyped = workData as {
        id?: string | number;
        title?: string;
        authors?: Array<{ name?: string }>;
        documentType?: string;
        fieldOfStudy?: string;
        doi?: string;
        publishedDate?: string;
        depositedDate?: string;
        abstract?: string;
    } | undefined;

    const outputsData = outputs
        .filter((output) => output.outputData && !output.error)
        .map((output) => ({
            data: output.outputData as {
                id?: string | number;
                title?: string;
                authors?: Array<{ name?: string }>;
                documentType?: string;
                fieldOfStudy?: string;
                doi?: string;
                publishedDate?: string;
                depositedDate?: string;
                abstract?: string;
                oai?: string;
            },
        }));

    const totalSlides = outputsData.length;
    const totalDots = totalSlides > slidesToShow ? totalSlides - slidesToShow + 1 : 0;
    const showIndicators = totalSlides > slidesToShow;

    if (isLoading || !workDataTyped) {
        return null;
    }

    return (
        <div className="compare-card-wrapper">
            {currentModalData && (
                <div className="compare-card-overlay">
                    <ActionModal
                        title={currentModalData.title}
                        typeText={currentModalData.type}
                        description={currentModalData.description}
                        buttonConfirm={currentModalData.confirm}
                        buttonCancel={currentModalData.cancel}
                        itemId={currentModalData.id}
                        onConfirm={() => handleModalConfirm(currentModalData)}
                        onCancel={handleModalClose}
                    />
                </div>
            )}
            <div className="data-title-wrapper">
                {generatedTitle.map((key, index) => (
                    <div className="data-title" key={index}>
                        {key}
                    </div>
                ))}
            </div>
            <section className="carousel-wrapper">
                <div className="compare-container">
                    <div className="compare-card-left">
                        <CrMessage className="reference-title-left">
                            <Tooltip
                                title={
                                    <Markdown className="data-item-reference">
                                        {TextData.comparison.reference}
                                    </Markdown>
                                }
                            >
                                <div className="action-item">
                                    <img className="referenceIcon" src={info} alt="info" />
                                </div>
                            </Tooltip>
                            <div className="text-spacer">
                                <b>The reference paper</b>
                            </div>
                        </CrMessage>

                        <div className="compare-title-wrapper-left">
                            <div className="compare-title">
                                <CrShowMore
                                    text={workDataTyped.title || ''}
                                    maxLetters={100}
                                />
                            </div>
                            <div className="redirect-button-wrapper">
                                <Button
                                    type="primary"
                                    onClick={() => handleWorksRedirect(workDataTyped.id)}
                                    className="visibility-icon-button"
                                >
                                    <EyeOutlined className="visibility" />
                                    <span>Live in CORE</span>
                                </Button>
                                <div className="visibility-place-holder" />
                            </div>
                        </div>

                        <div className="items-wrapper">
                            <div className="item-wrapper">
                                {modifiedWorksData.map((value, index) => (
                                    <div
                                        key={index}
                                        className={classNames('data-item', {
                                            'height': index === modifiedWorksData.length - 1,
                                            'author-height': index === 0,
                                        })}
                                    >
                                        <CrShowMore
                                            text={String(value || '')}
                                            maxLetters={index === modifiedWorksData.length - 1 ? 150 : 50}
                                        />
                                    </div>
                                ))}
                                <div className={classNames('data-item', 'not-avaliable')}>
                                    {TextData.comparison.version}
                                </div>
                                <div className={classNames('data-item', 'not-avaliable')}>
                                    {TextData.comparison.version}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carousel-container">
                        <Carousel
                            ref={carouselRef}
                            slidesToShow={slidesToShow}
                            slidesToScroll={1}
                            infinite={false}
                            autoplay={false}
                            dots={false}
                            afterChange={handleSlideChange}
                        >
                            {outputsData.map((item, idx) => {
                                const itemData = item.data;
                                return (
                                    <div key={idx} className="compare-card-right">
                                        <CrMessage className="reference-title">
                                            <img
                                                className="reference-icon"
                                                src={info}
                                                alt="info"
                                            />
                                            <div className="reference-text">
                                                {TextData.comparison.compareItem}
                                                <span className="oai-title">
                                                    OAI {itemData?.oai?.split(':').pop()}
                                                </span>
                                            </div>
                                        </CrMessage>

                                        <div className="compare-title-wrapper">
                                            <div className="compare-title">
                                                <CrShowMore
                                                    text={itemData?.title || ''}
                                                    maxLetters={100}
                                                />
                                            </div>
                                            <div className="redirect-button-wrapper">
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleOutputsRedirect(itemData?.id)}
                                                    className="visibility-icon-button"
                                                >
                                                    <EyeOutlined className="visibility" />
                                                    <span>Live in CORE</span>
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleRepositoryRedirect(itemData?.oai)}
                                                    className="visibility-icon-button"
                                                >
                                                    <span>Open in the repository</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="compare-items">
                                            <div
                                                className={classNames('data-item-authors', {
                                                    matched: !compareNames(
                                                        itemData?.authors?.map((author) => author.name).join(', '),
                                                        0
                                                    ),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.authors?.map((author) => author.name).join(', ') || ''}
                                                    maxLetters={50}
                                                />
                                            </div>
                                            <div
                                                className={classNames('output-item', {
                                                    'matched': !isMatching(itemData?.documentType, 1),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.documentType || ''}
                                                    maxLetters={50}
                                                />
                                            </div>
                                            <div
                                                className={classNames('output-item', {
                                                    'matched': !isMatching(itemData?.fieldOfStudy, 2),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.fieldOfStudy || ''}
                                                    maxLetters={50}
                                                />
                                            </div>
                                            <div
                                                className={classNames('output-item', {
                                                    'matched': !isMatching(itemData?.doi, 3),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.doi || ''}
                                                    maxLetters={50}
                                                />
                                            </div>
                                            <div
                                                className={classNames('output-item', {
                                                    'matched': !isMatching(itemData?.publishedDate, 4),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.publishedDate || ''}
                                                    maxLetters={50}
                                                />
                                            </div>
                                            <div
                                                className={classNames('output-item', {
                                                    'matched': !isMatching(itemData?.depositedDate, 5),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.depositedDate || ''}
                                                    maxLetters={50}
                                                />
                                            </div>
                                            <div
                                                className={classNames('height-output', {
                                                    'matched': !isMatching(itemData?.abstract, 6),
                                                })}
                                            >
                                                <CrShowMore
                                                    text={itemData?.abstract || ''}
                                                    maxLetters={150}
                                                />
                                            </div>
                                        </div>

                                        <TogglePanel
                                            title={
                                                <div
                                                    className={classNames('toggle-panel-title', {
                                                        'toggle-panel-title-active':
                                                            isVersionType(outputIdToApiType[String(itemData?.id)]),
                                                    })}
                                                >
                                                    {isVersionType(outputIdToApiType[String(itemData?.id)])
                                                        ? findTitlesBySelectedTypes(
                                                            TextData.comparison.toggleVersion[0]
                                                                ?.options || [],
                                                            outputIdToApiType[String(itemData?.id)] || ''
                                                        )
                                                        : TextData.comparison.toggleVersion[0]
                                                            ?.description ||
                                                        'Please indicate the version of articles:'}
                                                    {isVersionType(outputIdToApiType[String(itemData?.id)]) ? (
                                                        <img src={tickGreen} alt="check" />
                                                    ) : (
                                                        <div className="toggle-panel-arrow">
                                                            <img src={dropArrow} alt="togglerArrow" />
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            className="action-button-panel"
                                            content={
                                                <div className="action-buttons">
                                                    {(TextData.comparison.toggleVersion[0]?.options || []).map(
                                                        (option) => (
                                                            <div
                                                                key={option.type}
                                                                onClick={() => {
                                                                    if (itemData?.id != null) {
                                                                        handleTypeSave(
                                                                            itemData.id,
                                                                            option.type
                                                                        );
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (
                                                                        e.key === 'Enter' ||
                                                                        e.key === ' '
                                                                    ) {
                                                                        e.preventDefault();
                                                                        if (itemData?.id != null) {
                                                                            handleTypeSave(
                                                                                itemData.id,
                                                                                option.type
                                                                            );
                                                                        }
                                                                    }
                                                                }}
                                                                className={classNames(
                                                                    'option-button',
                                                                    {
                                                                        'option-button-clicked':
                                                                            outputIdToApiType[String(itemData?.id)] ===
                                                                            option.type,
                                                                    }
                                                                )}
                                                                role="button"
                                                                tabIndex={0}
                                                                aria-label={option.title}
                                                            >
                                                                <div>{option.title}</div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            }
                                        />

                                        <TogglePanel
                                            title={
                                                <div
                                                    className={classNames('toggle-panel-title', {
                                                        'toggle-panel-title-active':
                                                            !!outputIdToApiType[String(itemData?.id)],
                                                    })}
                                                >
                                                    {isVersionType(outputIdToApiType[String(itemData?.id)])
                                                        ? TextData.comparison.differentButton.title
                                                        : outputIdToApiType[String(itemData?.id)]
                                                            ? findTitlesBySelectedTypes(
                                                                modalContent,
                                                                outputIdToApiType[String(itemData?.id)] || ''
                                                            )
                                                            : 'Mark this paper as'}
                                                    {outputIdToApiType[String(itemData?.id)] ? (
                                                        <img src={tickGreen} alt="check" />
                                                    ) : (
                                                        <div className="toggle-panel-arrow">
                                                            <img src={dropArrow} alt="togglerArrow" />
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            className="action-button-panel"
                                            content={
                                                <div className="action-buttons">
                                                    {TextData.comparison.toggleButtons.map(
                                                        (button, index) => (
                                                            <div
                                                                key={button.type}
                                                                onClick={() => {
                                                                    if (itemData?.id != null) {
                                                                        handleModalOpen(
                                                                            itemData.id,
                                                                            index
                                                                        );
                                                                    }
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (
                                                                        e.key === 'Enter' ||
                                                                        e.key === ' '
                                                                    ) {
                                                                        e.preventDefault();
                                                                        if (itemData?.id != null) {
                                                                            handleModalOpen(
                                                                                itemData.id,
                                                                                index
                                                                            );
                                                                        }
                                                                    }
                                                                }}
                                                                className={classNames(
                                                                    'option-button',
                                                                    {
                                                                        'option-button-clicked':
                                                                            outputIdToApiType[String(itemData?.id)] ===
                                                                            button.type,
                                                                    }
                                                                )}
                                                                role="button"
                                                                tabIndex={0}
                                                                aria-label={button.title}
                                                            >
                                                                <div>{button.title}</div>
                                                                <InfoTooltip
                                                                    title={button.info}
                                                                    ariaLabel={button.info}
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                    <div
                                                        className={classNames(
                                                            'option-button',
                                                            'option-button-restrict',
                                                            {
                                                                'option-button-clicked':
                                                                    isVersionType(
                                                                        outputIdToApiType[String(itemData?.id)]
                                                                    ),
                                                            }
                                                        )}
                                                    >
                                                        <div>
                                                            {
                                                                TextData.comparison.differentButton
                                                                    .title
                                                            }
                                                        </div>
                                                        <InfoTooltip
                                                            title={
                                                                TextData.comparison.differentButton
                                                                    .info
                                                            }
                                                            ariaLabel={
                                                                TextData.comparison.differentButton
                                                                    .info
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </Carousel>
                        {showIndicators && (
                            <div className="carousel-controls">
                                <div
                                    onClick={handlePrev}
                                    className="carousel-arrow carousel-arrow-left"
                                    aria-label="Previous slide"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handlePrev();
                                        }
                                    }}
                                >
                                    <img alt="arrowLeft" src={arrowLeft} />
                                </div>
                                <div className="carousel-indicators">
                                    {Array.from({ length: totalDots }).map((_, index) => {
                                        const maxSlideIndex = Math.max(0, totalSlides - slidesToShow);
                                        const clampedSlide = Math.max(0, Math.min(currentSlide, maxSlideIndex));
                                        const activeDotIndex = Math.min(clampedSlide, totalDots - 1);
                                        const isActive = activeDotIndex === index;
                                        return (
                                            <div
                                                key={index}
                                                className={classNames('carousel-dot', {
                                                    'active': isActive,
                                                })}
                                            />
                                        );
                                    })}
                                </div>
                                <div
                                    onClick={handleNext}
                                    className="carousel-arrow carousel-arrow-right"
                                    aria-label="Next slide"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleNext();
                                        }
                                    }}
                                >
                                    <img alt="arrowRight" src={arrowRight} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
