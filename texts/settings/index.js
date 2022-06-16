import content from './settings.yml'

export default {
  ...content,
  mapping: {
    ...content.mapping,
    form: Object.values(content.mapping.form),
  },
}
