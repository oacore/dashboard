import das from './das.json'
import type { ArticleData } from '@features/Orcid/types/text.types.ts';



const articleTemplate = Object.keys(das.article).reduce<Partial<ArticleData>>(
  (a, key) => Object.assign(a, { [key]: Object.values((das.article as ArticleData)[key as keyof ArticleData]) }),
  {}
)


export const TextData = {
  ...das,
  actions: Object.values(das.actions),
  article: articleTemplate,
}
