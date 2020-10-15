import React from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import SlugPlugin from 'remark-slug'
import HeadingIdPlugin from 'remark-heading-id'

const MarkdownLink = ({ href, title, children }) => {
  const props = {
    href,
    title,
  }

  const isExternal =
    new URL(href, 'http://example.com').origin !== window?.location.origin
  if (isExternal) {
    Object.assign(props, {
      target: '_blank',
      rel: 'noopener',
    })
  }

  return <a {...props}>{children}</a>
}

const markdownConfig = {
  escapeHtml: false,

  renderers: {
    link: MarkdownLink,
    linkReference: MarkdownLink,
  },

  plugins: [[SlugPlugin], [HeadingIdPlugin]],
}

const Markdown = ({ children, tag, ...markdownProps }) => (
  <ReactMarkdown {...markdownConfig} {...markdownProps} root={tag}>
    {children}
  </ReactMarkdown>
)

export default Markdown
