const ASSETS_BASE_URL = 'https://oacore.github.io/content/';
const DESCRIPTION_PLACEHOLDER_REGEX = /({{\w+}})/g;

export const toAbsoluteAssetUrl = (file: string): string => {
  const f = String(file ?? '');
  if (!f) return '';
  if (f.startsWith('http')) return f;
  return ASSETS_BASE_URL + f.replace(/^\//, '');
};

export const cleanDescriptionPlaceholders = (
  text: string | undefined,
  replacement = ''
): string | undefined => {
  if (typeof text !== 'string') return undefined;
  return text.replace(DESCRIPTION_PLACEHOLDER_REGEX, replacement);
};

type ItemWithImages = {
  images?: Record<string, { file: string }>;
  descriptionDashboard?: string;
};

export const setAssetsUrl = (
  items: Record<string, ItemWithImages>,
  dataProviderId?: number
): void => {
  Object.values(items).forEach((value) => {
    if (value.images) {
      Object.values(value.images).forEach((item) => {
        item.file = toAbsoluteAssetUrl(item.file);
      });
    }
    if (value.descriptionDashboard && dataProviderId !== undefined) {
      value.descriptionDashboard = cleanDescriptionPlaceholders(
        value.descriptionDashboard,
        dataProviderId.toString()
      ) ?? value.descriptionDashboard;
    }
  });
};
