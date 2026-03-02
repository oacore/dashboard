import { Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <main>
      <h1>Welcome to Dashboard</h1>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
