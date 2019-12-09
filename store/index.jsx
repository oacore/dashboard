import React, { createContext } from 'react'
import { useStaticRendering, useLocalStore, observer } from 'mobx-react'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

const GlobalContext = createContext({})

export const initializeData = (initialData = {}) => {
  return {
    plugins: {
      discovery: {
        enabled: true,
      },
      recommender: {
        enabled: false,
      },
      analytics: {
        enabled: true,
      },
      reader: {
        enabled: false,
      },
    },
    ...initialData,
  }
}

export const withGlobalStore = Component => {
  return props => (
    <GlobalContext.Consumer>
      {value => {
        const ObservableComponent = observer(Component)
        return <ObservableComponent store={value} {...props} />
      }}
    </GlobalContext.Consumer>
  )
}

export const GlobalProvider = ({ children, initialData }) => {
  const store = useLocalStore(() => initializeData(initialData))
  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  )
}

export default GlobalProvider
