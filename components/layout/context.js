import { createContext } from 'react'

const LayoutContext = createContext({
  sidebarExpanded: false,
  repositorySelectOpen: false,
})

const { Provider, Consumer } = LayoutContext

export default LayoutContext
export { Provider, Consumer }
