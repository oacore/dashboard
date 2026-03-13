export interface DasData {
  oai: string;
  title: string;
  publicationDate: string;
  licenceRecognised: string;
  rrsReview: string;
  validationStatusDataAccess: string;
  authors: string[];
  articleId: string;
  dataAccessSentence?: string;
  [key: string]: unknown;
}

export interface DasStats {
  total: number;
  toReview: number;
}
