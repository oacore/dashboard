import rrs from './rrs.json'
import type { ArticleData } from '@features/Orcid/types/text.types.ts';



const articleTemplate = Object.keys(rrs.article).reduce<Partial<ArticleData>>(
  (a, key) => Object.assign(a, { [key]: Object.values((rrs.article as ArticleData)[key as keyof ArticleData]) }),
  {}
)


export const TextData = {
  ...rrs,
  actions: Object.values(rrs.actions),
  article: articleTemplate,
}
