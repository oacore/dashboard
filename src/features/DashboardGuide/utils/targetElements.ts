/**
 * Utility function for finding target elements for tutorial steps
 */
export const findTargetElement = (step: number): HTMLDivElement | null => {
    if (step === 2) {
        return document.querySelector('.logo-wrapper') as HTMLDivElement;
    }

    if (step === 3 || step === 4) {
        // Try to find by data attribute first
        const settingsMenuItem = document.querySelector(
            '.ant-menu-item[data-menu-id*="settings"], .ant-menu-submenu-title[data-menu-id*="settings"]'
        ) as HTMLDivElement;

        if (settingsMenuItem) return settingsMenuItem;

        // Fallback: find by text content
        const menuItems = document.querySelectorAll('.ant-menu-item, .ant-menu-submenu-title');
        for (const item of menuItems) {
            if (item.textContent?.includes('Settings')) {
                return item as HTMLDivElement;
            }
        }
    }

    return null;
};

