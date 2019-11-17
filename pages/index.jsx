import React from 'react'
import Head from 'next/head'


class Dashboard extends React.Component {
  render() {
    return (
      <>
        <Head>
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
            href='/favicon/favicon.svg'
          />
        </Head>
      </>
    )
  }
}

export default Dashboard
