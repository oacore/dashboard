import { createContext } from 'react'

const LayoutContext = createContext([
  {
    sidebarId: 'sidebar',
    sidebarExpanded: false,
  },
])

const { Provider, Consumer } = LayoutContext

export default LayoutContext
export { Provider, Consumer }
