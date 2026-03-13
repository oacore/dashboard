export type SwTextData = {
    title: string
    description: string

    settings: {
        title: string
        warning: string
        configure: {
            title: string
            description: string
            subDescription: string
            option: Array<{
                title: string
                id: string
            }>
        }
    }

    calendar: {
        title: string
    }

    statsCards: {
        ready: {
            title: string
            description: string
            action: string
            tooltip?: string
        }
        sent: {
            title: string
            description: string
            action: string
            tooltip?: string
            noticeable?: boolean
            disabled?: string
        }
        responded: {
            title: string
            description: string
            action: string
            tooltip?: string
            disabled?: string
        }
    }

    table: {
        actions: Array<{
            name: string
            defaultActive?: boolean
            action: string
            id: string
        }>
    }

    actions: Array<{
        title: string
        key: string
    }>

    notificationModal: {
        title: string
        description: string
        action: string
    }
}
