export interface ComplianceTotalButtons {
  review: string;
  download: string;
}

export interface ComplianceTotalSection {
  title: string;
  subTitle: string;
  description: string;
  buttons: ComplianceTotalButtons;
}

export interface ComplianceSectionWithButton {
  title: string;
  subTitle: string;
  description: string;
  button: string;
}

export interface ComplianceSections {
  total: ComplianceTotalSection;
  compliant: ComplianceSectionWithButton;
  nonCompliant: ComplianceSectionWithButton;
  unknown: ComplianceSectionWithButton;
  cross: ComplianceSectionWithButton;
}

export interface CrossRepositoryCheckSection {
  title: string;
  description: string;
  download: string;
  paymentRequired: string;
}

export interface PublicationDatesSection {
  title: string;
  description: string;
  tooltip: string;
  matching: string;
  incorrect: string;
  different: string;
}

export interface ComplianceTextData {
  title: string;
  description: string;
  regionWarning?: string;
  compliance: ComplianceSections;
  chart?: {
    title: string;
    body: string;
    warning?: string;
  };
  noData?: {
    body: string;
  };
  crossRepositoryCheck?: CrossRepositoryCheckSection;
  publicationDates?: PublicationDatesSection;
}
