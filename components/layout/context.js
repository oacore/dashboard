import { createContext } from 'react'

const LayoutContext = createContext({
  sidebarExpanded: false,
})

const { Provider, Consumer } = LayoutContext

export default LayoutContext
export { Provider, Consumer }
