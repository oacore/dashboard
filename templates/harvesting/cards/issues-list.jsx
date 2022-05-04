import React from 'react'

import styles from '../styles.module.css'

import { Icon, Link } from 'design'

const IssuesList = ({ issues }) => (
  <ul className={styles.list}>
    {issues.map(({ id: issueId, output }) => (
      <li key={issueId}>
        {output && output.id && (
          <Link
            href={`https://core.ac.uk/display/${output.id}`}
            className={styles.outputLink}
            title="Open the record page"
          >
            <Icon src="#open-in-new" className={styles.outputIcon} />
            <span className={styles.outputId}>{output.oai}</span>{' '}
            <div className={styles.outputLine}>
              <span className={styles.outputAuthor}>
                {output.authors[0]} {output.authors.length > 1 && ' et al.'}
              </span>{' '}
              <span className={styles.outputTitle}>{output.title}</span>
            </div>
          </Link>
        )}
      </li>
    ))}
  </ul>
)

export default IssuesList
