export interface ValidatorAction {
  name: string;
  action: string;
}

export interface SubTitleAction {
  text: string;
  value: string;
}

export interface ValidatorSubTitle {
  title: string;
  actions: SubTitleAction[];
}

export interface ValidatorData {
  actions: ValidatorAction[];
  title: string;
  subTitle: ValidatorSubTitle;
  action: string;
}

export interface IssuesData {
  issueTitle: string;
  placeholder: string;
  warningTitle: string;
  warningPlaceholder: string;
}

export interface ErrorPlaceholderData {
  text: string;
}

export interface ValidationMessage {
  title: string;
  key: string;
  severity: string;
  description: string;
  resolution: string;
  seeMoreLink: string;
  matches?: Record<string, string>;
}

export interface ValidatorTextData {
  title: string;
  description: string;
  rioxInfo: string;
  validator: ValidatorData;
  issues: IssuesData;
  errorPlaceholder: ErrorPlaceholderData;
  validations: ValidationMessage[];
  issueTooltip: string;
  issueDescription: string;
  warningTooltip: string;
  warningDescription: string;
}
