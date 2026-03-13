export interface InfoData {
    title: string;
    countTitle: string;
    subTitle: string;
    description: string;
    action: string;
    info: string;
    listOfDuplicates: string;
}

export interface StatisticsData {
    title: string;
    countTitle: string;
    subTitle: string;
}

export interface MoreInfoData {
    action: string;
    description: string;
    tableTitle: string;
    duplicates: string;
    publicationDate: string;
    show: string;
    hide: string;
}

export interface HelpInfoData {
    actionBtn: string;
    description: string;
    show: string;
    hide: string;
}

export interface CachedInfoData {
    title: string;
    actionBtn: string;
}

export interface ComparisonOption {
    title: string;
    description: string;
}

export interface MoreInfoComparisonData {
    action: string;
    title: string;
    description: string;
    options: ComparisonOption[];
    tableTitle: string;
    innerTableTitle: string;
    deduplicationTitle: string;
}

export interface ActionData {
    title: string;
    key: string;
}

export interface ComparisonItem {
    title: string;
    description: string;
}

export interface ComparisonButton {
    title: string;
    type: string;
}

export interface ToggleButton {
    title: string;
    type: string;
    info: string;
}

export interface DifferentButton {
    title: string;
    info: string;
}

export interface VersionOption {
    title: string;
    type: string;
}

export interface ToggleVersion {
    title: string;
    index: number;
    type: string;
    description: string;
    options: VersionOption[];
    confirm: string;
    cancel: string;
}

export interface ToggleModalData {
    title: string;
    index: number;
    type: string;
    description: string;
    confirm: string;
    cancel: string;
}

export interface ModalData {
    title: string;
    index: number;
    type: string;
    description: string;
    confirm: string;
    cancel: string;
}

export interface ComparisonData {
    title: string;
    subTitle: string;
    referenceTitle: string;
    version: string;
    reference: string;
    compareItem: string;
    items: ComparisonItem[];
    buttons: ComparisonButton[];
    toggleButtons: ToggleButton[];
    differentButton: DifferentButton;
    toggleVersion: ToggleVersion[];
    toggleModalData: ToggleModalData[];
    modalData: ModalData[];
}

export interface GuideCardData {
    title: string;
    description: string;
    action: string;
}

export interface StatsCardData {
    title: string;
    description: string;
    subAction: string;
}

export interface TableData {
    title: string;
}

export interface HelpInfoData {
    actionBtn: string;
    description: string;
    show: string;
    hide: string;
}


export interface duplicatesTextData {
    title: string;
    description: string;
    info: InfoData;
    statistics: StatisticsData;
    moreInfo: MoreInfoData;
    helpInfo: HelpInfoData;
    cachedInfo: CachedInfoData;
    moreInfoComparison: MoreInfoComparisonData;
    actions: ActionData[];
    comparison: ComparisonData;
    guideCard: GuideCardData;
    statsCard: StatsCardData;
    table: TableData;
}
