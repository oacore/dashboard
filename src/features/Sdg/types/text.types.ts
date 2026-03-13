export interface ToggleData {
    title: string;
}

export interface ChartTable {
    title: string;
}

export interface ChartData {
    toggle: ToggleData;
    table: ChartTable;
}

export interface TableData {
    title: string;
}

export interface TabData {
    yearly: string;
    overall: string;
}

export interface NoSdgData {
    title: string;
    description: string;
    message: string;
    button: string;
}

export interface SdgSuggestionData {
    description: string;
}

export interface CardAction {
    title: string;
}

export interface CardData {
    title: string;
    tooltip: string;
    action: CardAction;
}

export interface SdgTextData {
    title: string;
    description: string;
    chart: ChartData;
    table: TableData;
    tab: TabData;
    noSdg: NoSdgData;
    sdgSuggestion: SdgSuggestionData;
    card: CardData;
}
