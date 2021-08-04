import React, { useEffect, useState, useCallback } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './issue-card.module.css'

import { Card, Button, Link, Icon } from 'design'
import Markdown from 'components/markdown'

const useIssues = ({ pages }) => {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (!pages) return

    setLoading(true)
    const data = await pages.slice(0, issues.length + 10)
    await Promise.allSettled(
      data
        .filter(({ output }) => output == null)
        .map((issue) =>
          pages.request(issue.outputUrl).then((response) => {
            issue.output = response.data
          })
        )
    )
    setLoading(false)
    setIssues(data)
  }, [pages, issues])

  useEffect(
    () => () => {
      // Clear loaded data to free up memory. Not a big deal though
      if (pages) pages.reset({ type: pages.type })
    },
    []
  )

  return {
    loadMore,
    loading,
    data: issues,
    done: !pages ? true : pages.isLastPageLoaded,
  }
}

const IssueCard = ({
  title,
  description,
  count,
  className,
  issuesList,
  ...restProps
}) => {
  const [listHidden, setListHidden] = useState(true)
  const {
    data: issues,
    loadMore: loadMoreIssues,
    loading: issuesLoading,
    done: allIssuesLoaded,
  } = useIssues({ pages: issuesList })

  const showList = useCallback(() => {
    setListHidden(false)
    loadMoreIssues()
  }, [])

  return (
    <Card
      className={classNames
        .use(
          styles.card,
          count === 0 && styles.none,
          count === 2 && styles.two,
          count > 2 && styles.multiple,
          !listHidden && styles.expanded
        )
        .join(className)}
      {...restProps}
    >
      <Card.Title tag="h3">{title}</Card.Title>

      <Markdown>{description}</Markdown>

      <p>
        <b>
          {count} record{count === 1 ? '' : 's'}
        </b>{' '}
        {count === 1 ? 'is' : 'are'} affected by this issue.
      </p>

      <ul className={styles.list} hidden={listHidden}>
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

      <p>
        <Button
          variant="contained"
          disabled={!issuesList}
          hidden={!listHidden}
          onClick={showList}
        >
          Show the list
        </Button>
        <Button
          variant="contained"
          disabled={issuesLoading}
          hidden={listHidden || allIssuesLoaded}
          onClick={loadMoreIssues}
        >
          Load more
        </Button>
      </p>
    </Card>
  )
}

export default IssueCard
