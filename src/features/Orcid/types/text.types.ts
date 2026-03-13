export interface ArticleField {
    name: string
    key: string
    findBy?: string
}

export interface ArticleAction {
    title: string
    key: string
    generatedUrl?: string
}

export interface ArticleVisibility {
    title: string
    disabled: boolean
    icon: string
    extraText: string
}

export interface ArticleData {
    fields: ArticleField[]
    actions: ArticleAction[]
    visibility: ArticleVisibility[]
}