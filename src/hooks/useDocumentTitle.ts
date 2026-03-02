import { useEffect } from "react"

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${import.meta.env.VITE_APP_NAME}`
  }, [title])
}