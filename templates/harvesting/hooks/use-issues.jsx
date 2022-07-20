import { useState, useCallback, useEffect } from 'react'

import request from 'api'

const useIssues = ({ pages }) => {
  const [issues, setIssues] = useState([])
  const [issueWithArticles, setIssueWithArticles] = useState({})
  const [activeArticle, setActiveArticle] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadMore = useCallback(
    async ({ initial = false }) => {
      if (!pages) return
      setLoading(true)

      const data = initial
        ? await pages.slice(0, 10)
        : await pages.slice(0, issues.length + 10)

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
      setIssueWithArticles({
        ...pages,
        data,
        size: data.length,
      })
      setIssues(data)
    },
    [issues]
  )

  useEffect(
    () => () => {
      // Clear loaded data to free up memory. Not a big deal though
      if (pages) pages.reset({ type: pages.type })
    },
    []
  )

  const onSetActiveArticle = useCallback(
    (id) => {
      const output = issueWithArticles?.data.find(
        (issue) => issue.id === id
      )?.output

      output.outputUrl = `https://core.ac.uk/outputs/${output?.id}`

      setActiveArticle(output)
    },
    [issueWithArticles]
  )

  const changeArticleVisibility = async (article) => {
    setLoading(true)
    try {
      await request(`/articles/${article.id}`, {
        method: 'PATCH',
        body: { disabled: !article?.disabled },
      })

      setActiveArticle(
        Object.assign(article, {
          disabled: !article?.disabled,
        })
      )
    } catch (error) {
      throw Error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    loadMore,
    loading,
    data: issueWithArticles,
    done: !pages ? true : pages.isLastPageLoaded,
    onSetActiveArticle,
    changeArticleVisibility,
    activeArticle,
  }
}

export default useIssues
