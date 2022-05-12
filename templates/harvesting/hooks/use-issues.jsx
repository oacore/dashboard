import { useState, useCallback, useEffect } from 'react'

const useIssues = ({ pages }) => {
  const [issues, setIssues] = useState([])
  const [issueWithArticles, setIssueWithArticles] = useState({})
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
    setIssueWithArticles({
      ...pages,
      data,
      size: data.length,
    })
    setIssues(data)
  }, [issues])

  useEffect(
    () => () => {
      // Clear loaded data to free up memory. Not a big deal though
      if (pages) pages.reset({ type: pages.type })
    },
    []
  )

  const onCleanList = () => {
    if (pages) pages.reset({ type: pages.type })
    setIssues([])
    setIssueWithArticles(null)
  }

  return {
    loadMore,
    loading,
    data: issueWithArticles,
    done: !pages ? true : pages.isLastPageLoaded,
    onCleanList,
  }
}

export default useIssues
