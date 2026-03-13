export interface RrsData {
  oai: string;
  title: string;
  publicationDate: string;
  licenceRecognised: string;
  rrsReview: string;
  validationStatusRRS: string;
  authors: string[];
  articleId: string;
  rightsRetentionSentence?: string;
}

export interface RrsStats {
  total: number;
  toReview: number;
}
