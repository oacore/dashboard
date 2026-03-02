import '@ant-design/v5-patch-for-react-19';
import '@core/core-ui/styles';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './styles/index.css'
import './styles/theme.css'
import { antdTheme as coreTheme } from '@core/core-ui';
import { antdTheme as localTheme } from './config/theme'

import App from './App'

const mergedTheme = {
  ...coreTheme,
  token: {
    ...coreTheme.token,
    ...localTheme.token,
  },
  components: {
    ...coreTheme.components,
    ...localTheme.components,
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={mergedTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
