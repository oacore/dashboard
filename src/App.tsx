import '@styles/App.css'
import { SWRConfig } from 'swr';
import { swrConfig } from '@config/swr';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return (
    <SWRConfig value={swrConfig}>
      <RouterProvider router={router} />
    </SWRConfig>
  )
}

export default App
