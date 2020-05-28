import { useContext } from 'react'

import LayoutContext from './context'

const useSidebar = () => {
  const [state, modify] = useContext(LayoutContext)
  const { sidebarId: id, sidebarExpanded: isOpen } = state

  const toggle = (force) => {
    const value = force == null ? !isOpen : force
    modify({
      ...state,
      sidebarExpanded: value,
    })
  }

  const open = toggle.bind(null, true)
  const close = toggle.bind(null, false)

  return {
    id,
    isOpen,

    toggle,
    open,
    close,
  }
}

export default useSidebar
