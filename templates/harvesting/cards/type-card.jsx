import React, { useState } from 'react'
import { classNames } from '@oacore/design/lib/utils'

import styles from '../styles.module.css'
import useIssues from '../hooks/use-issues'
import ArticlesList from './articles-list'

import Markdown from 'components/markdown'
import { Button, Icon } from 'design'
import texts from 'texts/issues'

const TypeCard = ({
  type,
  count,
  title,
  description,
  resolution,
  issuesList,
  hidden,
}) => {
  const [visibleList, setVisibleList] = useState(false)
  const {
    data: articles,
    loadMore: loadMoreArticles,
    loading: articlesLoading,
    onSetActiveArticle,
    activeArticle,
    changeArticleVisibility,
    onReset,
  } = useIssues({ pages: issuesList })

  const toggleVisibleList = () => {
    setVisibleList(!visibleList)
    if (!visibleList) onReset()
  }

  return (
    <li
      className={classNames.use(styles.typeCard, {
        [styles.typeCardHidden]: hidden,
      })}
    >
      <div className={styles.typeCardSection}>
        <div className={styles.typeCardHeader}>
          <Icon
            src="#alert"
            className={classNames.use(`${styles[`cardIcon${type}`]}`)}
          />
          <h3 className={styles.typeCardTitle}>{title}</h3>
        </div>
        <p>{description}</p>
        <div
          className={classNames.use(
            styles.typeCardCount,
            `${styles[`typeCardCount${type}`]}`
          )}
        >
          <span>{count.toLocaleString()}</span> {texts.issues.affected}
        </div>
      </div>
      <div className={styles.typeCardSection}>
        <div className={styles.typeCardHeader}>
          <Icon src="#comment-multiple" className={styles.cardIconComment} />
          <h3 className={styles.typeCardTitle}>
            {texts.issues.recommendationCardTitle}
          </h3>
        </div>
        <Markdown>{resolution}</Markdown>
        <div className={styles.typeCardActions}>
          <Button variant="contained" href={issuesList.downloadUrl}>
            {texts.issues.downloadAction}
          </Button>
          <Button
            variant="outlined"
            disabled={articlesLoading}
            onClick={toggleVisibleList}
          >
            {visibleList
              ? texts.issues.listActions.hide
              : texts.issues.listActions.show}
          </Button>
        </div>
      </div>
      {visibleList && Object.keys(articles).length > 0 && (
        <ArticlesList
          fetchData={loadMoreArticles}
          issuesList={articles}
          visible={visibleList}
          loading={articlesLoading}
          activeArticle={activeArticle}
          onSetActiveArticle={onSetActiveArticle}
          changeArticleVisibility={changeArticleVisibility}
        />
      )}
    </li>
  )
}

export default TypeCard
