import React from 'react'
import ReactMarkdown from 'react-markdown/with-html'

const MarkdownLink = ({ href, title, children }) => {
  const props = {
    href,
    title,
  }

  const isExternal = new URL(href).origin !== window?.location.origin
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
}

const Markdown = ({ children, tag, ...markdownProps }) => (
  <ReactMarkdown {...markdownConfig} {...markdownProps} root={tag}>
    {children}
  </ReactMarkdown>
)

export default Markdown
