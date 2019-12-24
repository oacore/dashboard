import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    const pathname = `${router.pathname}/overview`
    const slash = router.asPath.substr(-1) !== '/' ? '/' : ''
    const asPath = `${router.asPath}${slash}overview`

    router.replace(pathname, asPath)
  }, [])

  return null
}

export default Index
