import retrieveContent from '@/utils/retrieveContent';
import {
  toAbsoluteAssetUrl,
  cleanDescriptionPlaceholders,
} from '@/utils/contentUtils';

export type BadgeImage = { file: string; source?: string };

export type BadgesData = {
  title: string;
  descriptionDashboard?: string;
  images?: BadgeImage[];
};

type DocsSection = {
  items?: unknown[];
  [key: string]: unknown;
};

type MembershipContent = {
  docs?: DocsSection;
  [key: string]: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const extractBadgesFromContent = (content: MembershipContent): BadgesData => {
  const items = Array.isArray(content.docs?.items) ? content.docs.items : [];
  const last = items.length > 0 ? items[items.length - 1] : undefined;

  if (!isRecord(last)) {
    return { title: 'CORE badges', images: [] };
  }

  const title =
    typeof last.title === 'string' ? last.title : 'CORE badges';
  const rawDescription =
    typeof last.descriptionDashboard === 'string'
      ? last.descriptionDashboard
      : undefined;
  const descriptionDashboard = cleanDescriptionPlaceholders(
    rawDescription,
    ''
  );

  const imagesRaw = last.images;
  const images: BadgeImage[] = Array.isArray(imagesRaw)
    ? imagesRaw
        .filter(isRecord)
        .map((img) => ({
          file: toAbsoluteAssetUrl(
            typeof img.file === 'string' ? img.file : ''
          ),
          source: typeof img.source === 'string' ? img.source : undefined,
        }))
        .filter((img) => Boolean(img.file))
    : [];

  return {
    title,
    descriptionDashboard,
    images,
  };
};

export const getBadges = async (ref?: string): Promise<BadgesData> => {
  const content = (await retrieveContent('docs-membership', {
    ref,
    transform: 'object',
  })) as MembershipContent;

  return extractBadgesFromContent(content);
};
