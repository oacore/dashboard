import { createContext } from 'react'

// The simplification to pass a Number instead object
// It can be converted to `SectionContext({ level: 1 })` in the future
const LevelContext = createContext(1)

export default LevelContext
