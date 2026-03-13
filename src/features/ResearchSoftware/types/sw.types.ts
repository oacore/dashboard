export type SwTab = 'ready' | 'sent' | 'responded' | 'cancelled'

export type SwCounts = {
    ready_for_validation?: number
    sent?: number
    responded?: number,
    cancelled?: number
}

export type SwCitation = {
    software: string
    context: string
    type: string
    url: string
    confidence?: number
}

export type SwRow = {
    articleId: string | number
    oai: string
    title?: string
    authors?: string[] | string
    softwareCitations?: SwCitation[]
}

export type SwGroups = {
    ready_for_validation?: SwRow[]
    sent?: SwRow[]
    responded?: SwRow[]
    cancelled?: SwRow[]
}

export type SwResponse = {
    counts?: SwCounts
    groups?: SwGroups
    swUrls?: Partial<Record<SwTab, string>>
    swUrl?: string
}


