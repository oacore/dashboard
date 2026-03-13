export interface YearlyData {
  [year: string]: number
}

export interface SdgDataItem {
  type: string
  yearlyData: YearlyData
}

export interface SdgYearDataResponse {
  data: {
    [sdgId: string]: SdgDataItem
  }
}

export interface SdgYearDataParams {
  dataProviderId: number | null;
}

export interface SdgTableAuthor {
  name: string
}

export interface SdgTableDataProvider {
  id: number
  name: string
  url: string
  logo: string
}

export interface SdgTableIdentifiers {
  doi?: string
  oai?: string
  [key: string]: string | undefined
}

export interface SdgTableLink {
  type: string
  url: string
}

export interface SdgTableJournal {
  title: string
  identifiers: string[]
}

export interface SdgTableRepository {
  id: string
  openDoarId: number
  name: string
  urlHomepage: string | null
  uriJournals: string | null
  physicalName: string
  roarId: number
  baseId: number
  pdfStatus: string | null
  nrUpdates: number
  lastUpdateTime: string | null
}

export interface SdgTableRepositoryDocument {
  id: number
  publishedDate: string
  updatedDate: string
  createdDate: string
}

export interface SdgTableSdg {
  type: string
  score: string
}

export interface SdgTableDataItem {
  authors: SdgTableAuthor[]
  contributors: string[]
  createdDate: string
  dataProvider: SdgTableDataProvider
  documentType: string[]
  versions: unknown[]
  doi: string
  downloadUrl: string
  id: number
  identifiers: SdgTableIdentifiers
  title: string
  publishedDate: string
  references: unknown[]
  sourceFulltextUrls: string[]
  yearPublished: string
  links: SdgTableLink[]
  abstract: string
  tags: string[]
  fulltextStatus: string
  subjects: string[]
  oai: string
  deleted: string
  journals: SdgTableJournal[]
  repositories: SdgTableRepository
  repositoryDocument: SdgTableRepositoryDocument
  urls: string[]
  lastUpdate: string
  setSpecs: string[]
  orcids: unknown[]
  sdg: SdgTableSdg[]
}
