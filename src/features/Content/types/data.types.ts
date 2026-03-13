export interface ContentData {
  id: number;
  oai: string;
  identifiers: {
    doi?: string;
    [key: string]: string | undefined;
  };
  title: string;
  fullText: string;
  disabled: boolean;
  lastUpdate: string;
  authors: Array<{ name: string }>;
  links: Array<{
    url: string | undefined;
    type: string; name: string
  }>;
}
