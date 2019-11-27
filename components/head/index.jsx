import React from 'react'
import NextHead from 'next/head'

const Head = () => (
  <NextHead>
    <title>CORE Dashboard</title>

    {['64', '128', '256', '512'].map(size => (
      <link
        key={size}
        rel="icon"
        type="image/png"
        sizes={`${size}x${size}`}
        href={`/favicon/favicon-${size}px.png`}
      />
    ))}

    <link
      rel="icon"
      sizes="any"
      type="image/svg+xml"
      href="/favicon/favicon.svg"
    />
    <style>
      {`
          html,
          body,
          #__next {
            margin: 0;
            height: 100%;
          }
        `}
    </style>
  </NextHead>
)

export default Head
