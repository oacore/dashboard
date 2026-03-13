import type { ArticleData } from '../types/text.types'
import orcid from './orcid.json'



const articleTemplate = Object.keys(orcid.article).reduce<Partial<ArticleData>>(
  (a, key) => Object.assign(a, { [key]: Object.values((orcid.article as ArticleData)[key as keyof ArticleData]) }),
  {}
)


export const TextData = {
  ...orcid,
  actions: Object.values(orcid.actions),
  article: articleTemplate,
}
