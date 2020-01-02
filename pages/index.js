import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    const pathname = '/data-providers/[data-provider-id]'
    const asPath = '/data-providers/1'
    router.replace(pathname, asPath)
  }, [])

  return null
}

export default Index
