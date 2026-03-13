export interface MembershipAction {
    caption: string;
    url: string;
}

export interface MembershipPlanCard {
    title: string;
    description: string;
    default?: boolean;
    action?: MembershipAction;
}

export interface MembershipPlansSelected {
    header: string;
    card: string;
}

export interface MembershipPlans {
    selected: MembershipPlansSelected;
    cards: MembershipPlanCard[];
}

export interface MembershipBox {
    text: string;
    action: MembershipAction;
}

export interface DocumentationSwitcherItem {
    title: string;
    description: string;
}

export interface MembershipTextData {
    title: string;
    description: string;
    plans: MembershipPlans;
    box: MembershipBox;
    documentationSwitcher: DocumentationSwitcherItem[];
}
