// We use more than a single extension of Table.Column
/* eslint-disable max-classes-per-file */

import React from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from './issues.module.css'

import texts from 'texts/issues'
import { Button, Card, Icon } from 'design'
import NumericValue from 'components/numeric-value'
import { valueOrDefault } from 'utils/helpers'
import { withGlobalStore } from 'store'
import Table from 'components/table'

const formatDate = (date) => new Intl.DateTimeFormat('en-GB').format(date)

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

const Issues = ({ className, store, tag: Tag = 'main', ...restProps }) => {
  const { lastHarvestingDate } = store.issues.harvestingStatus || {}
  const { globalsCount, errorsCount, warningsCount } =
    store.issues.aggregation || {}
  const totalCount = errorsCount + warningsCount
  const harvesting = {
    date:
      lastHarvestingDate != null
        ? formatDate(new Date(lastHarvestingDate))
        : null,
    caption:
      globalsCount == null ? 'aborted due to error' : 'harvested successfully',
  }

  const filterOptions = [
    {
      id: '',
      name: `All issues (${totalCount})`,
    },
    ...Object.entries(store.issues.aggregation?.countByType ?? {})
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({
        id: type,
        name: `${texts.messages[type]?.title || type} (${count})`,
      })),
  ]

  return (
    <Tag className={[styles.container, className].join(' ')} {...restProps}>
      <Card className={styles.harvestingOverview} tag="section">
        <Card.Title tag="h2">Harvesting status</Card.Title>
        <NumericValue
          value={valueOrDefault(harvesting.date, 'Loading...')}
          caption={globalsCount == null ? 'Loading...' : harvesting.caption}
          tag="p"
        />
      </Card>

      <Card className={styles.errorsOverview} tag="section">
        <Card.Title tag="h2">Issues overview</Card.Title>
        <div className={styles.numbers}>
          <NumericValue
            value={valueOrDefault(totalCount, 'Loading...')}
            caption="documents affected"
            tag="p"
          />
          <NumericValue
            className={classNames.use(errorsCount && styles.errorsCount)}
            value={valueOrDefault(errorsCount, 'Loading...')}
            caption="with errors"
            tag="p"
          />
        </div>
      </Card>
      <Card>
        <Card.Title tag="h2">Browse issues</Card.Title>
        <Table
          key={store.dataProvider}
          title="Browse issues"
          className={styles.issuesTable}
          pages={store.issues.issues}
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
    </Tag>
  )
}

export default withGlobalStore(Issues)
