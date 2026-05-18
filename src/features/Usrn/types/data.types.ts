export type SupportStatusVariant = 'yes' | 'no' | '';

export interface UsrnData {
  dateReportUpdate?: unknown;
  license?: unknown;
  /** Records with FAIR Signposting signals (USRN `/usrn` API). */
  supportSignposting?: unknown;
  /** Records using COAR vocabularies in metadata (USRN `/usrn` API). */
  vocabulariesCOAR?: unknown;
  [key: string]: unknown;
}
