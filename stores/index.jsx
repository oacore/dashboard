import React, { createContext } from 'react'
import { useStaticRendering, useLocalStore, observer } from 'mobx-react'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

const GlobalContext = createContext({})

export const initializeData = (initialData = {}) => {
  return Object.preventExtensions({
    text: '',
    user: {
      id: null,
    },
    ...initialData,
  })
}

export const withGlobalStore = Component => {
  return ({ props }) => (
    <GlobalContext.Consumer>
      {value => {
        const ObservableComponent = observer(Component)
        return <ObservableComponent {...props} store={value} />
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
