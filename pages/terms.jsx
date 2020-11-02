import React from 'react'
import { classNames } from '@oacore/design/lib/utils'
import { MDXProvider } from '@mdx-js/react'

import styles from './terms.module.css'

import texts from 'texts/legal'
import Title from 'components/title'
import { Section, Heading } from 'components/content'

const TermsPage = ({ className, ...restProps }) => (
  <main
    className={classNames.use(className, styles.page, styles.enumerated)}
    lang="en-GB"
    {...restProps}
  >
    <Title>{texts.terms.title}</Title>
    <MDXProvider
      components={{
        Section,
        Heading,
      }}
    >
      {texts.terms.body.render()}
    </MDXProvider>
  </main>
)

export default TermsPage
