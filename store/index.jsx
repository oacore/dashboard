import React, { createContext, useContext } from 'react'
import { useStaticRendering, useLocalStore, observer } from 'mobx-react'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

const GlobalContext = createContext({})

export const initializeData = (initialData = {}) => ({
  repository: {
    id: 1,
    name: 'Open Research Online',
  },
  plugins: null,
  ...initialData,
})

export const withGlobalStore = Component => {
  const ObservableComponent = observer(Component)
  return props => {
    const context = useContext(GlobalContext)
    return <ObservableComponent store={context} {...props} />
  }
}

export const GlobalProvider = ({ children, initialData }) => {
  const store = useLocalStore(() => initializeData(initialData))
  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  )
}

export default GlobalProvider
