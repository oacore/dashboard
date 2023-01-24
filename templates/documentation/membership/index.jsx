import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './styles.module.css'

const DocumentationMembershipPageTemplate = ({ header, docs }) => (
  <div>
    <h2>{header.header1.title}</h2>
    <p>{header.header1.caption}</p>
    <br />
    <h2>{header.header2.title}</h2>
    <p>{header.header2.caption}</p>
    <br />
    <br />
    {docs.items.map((item) => (
      <div key={item.id}>
        <h3>{item.title} </h3>

        {item.membership.map((member) => (
          <span
            className={classNames
              .use(styles.membership)
              .join(member.status ? styles.enabled : styles.disabled)}
          >
            {member.name}
          </span>
        ))}

        <p>{item.description}</p>
        <br />
        <br />
      </div>
    ))}
  </div>
)

export default DocumentationMembershipPageTemplate
