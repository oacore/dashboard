import { useCallback, useEffect, useState } from 'react'

// eslint-disable-next-line import/prefer-default-export
export const useNotification = (userID) => {
  const [notifications, setNotifications] = useState([])

  const getNotifications = useCallback(async (id) => {
    try {
      if (!id) return

      const response = await fetch(`${process.env.API_URL}/notifications/${id}`)
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications data:', error)
    }
  }, [])

  useEffect(() => {
    getNotifications(userID)
  }, [userID, getNotifications])

  return { notifications, refetch: getNotifications }
}
