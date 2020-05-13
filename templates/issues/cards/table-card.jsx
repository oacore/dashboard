// We use more than a single extension of Table.Column
/* eslint-disable max-classes-per-file */

import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'

import { Card, Button, Icon } from 'design'
import Table from 'components/table'
import texts from 'texts/issues'

class TitleColumn extends Table.Column {
  render() {
    const { type, severity } = this.props.context
    const title = texts.messages[type]?.title ?? type

    return (
      <>
        <Icon
          className={classNames.use(
            styles.issueIcon,
            styles[severity.toLowerCase()]
          )}
          src="#alert-circle"
          alt={severity}
        />{' '}
        {title}
      </>
    )
  }
}

class RecordColumn extends Table.Column {
  render() {
    const id = this.props.context.outputUrl.split('/').pop()
    const url = `https://core.ac.uk/display/${id}`

    return (
      // We want to pass referrer and opener to our website
      <Button
        variant="text"
        className={styles.tableButton}
        href={url}
        target="_blank"
      >
        View <Icon src="#open-in-new" alt="in new" />
      </Button>
    )
  }
}

const TableCard = ({ totalCount, aggregation, pages }) => {
  const filterOptions = [
    {
      id: '',
      name: `All issues (${totalCount})`,
    },
    ...Object.entries(aggregation?.countByType ?? {})
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({
        id: type,
        name: `${texts.messages[type]?.title || type} (${count})`,
      })),
  ]

  return (
    <Card>
      <Card.Title tag="h2">Browse issues</Card.Title>
      <Table
        title="Browse issues"
        className={styles.issuesTable}
        pages={pages}
        selectable
        options={filterOptions}
      >
        <TitleColumn
          id="title"
          display="Issue type"
          className={styles.titleColumn}
        />
        <RecordColumn
          id="record"
          display="Record"
          className={styles.linkColumn}
        />
      </Table>
    </Card>
  )
}

export default TableCard
