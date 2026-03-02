import indexing from './indexing.json';
import sourceMessages from './messages.json';
import type { ArticleData } from '@features/Orcid/types/text.types.ts';

const messages: Record<string, unknown> = {};

// Process messages array - each message type and its matches become keys
sourceMessages.forEach((msg) => {
  messages[msg.type] = msg;
  (msg.matches ?? []).forEach((type: string) => {
    messages[type] = msg;
  });
});

const articleTemplate = Object.keys(indexing.article).reduce<Partial<ArticleData>>(
  (a, key) => Object.assign(a, { [key]: Object.values((indexing.article as ArticleData)[key as keyof ArticleData]) }),
  {}
);

const TextData = {
  ...indexing,
  actions: Object.values(indexing.actions),
  article: articleTemplate,
  messages,
};

export { TextData };
export default TextData;

