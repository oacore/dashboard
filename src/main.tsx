import '@oacore/core-ui/styles';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import './styles/index.css'
import './styles/theme.css'
import { antdTheme as coreTheme } from '@oacore/core-ui';
import { antdTheme as localTheme } from '@/config/theme'
import { setUnauthorizedHandler } from '@/config/auth401Handler';
import { useAuthStore } from '@/store/authStore';

import App from './App'

setUnauthorizedHandler(() => {
  useAuthStore.getState().clearSession();
  window.location.href = '/login?reason=logout_unexpectedly';
});

const mergedTheme = {
  ...coreTheme,
  token: {
    ...coreTheme?.token,
    ...localTheme?.token,
  },
  components: {
    ...coreTheme?.components,
    ...localTheme?.components,
  },
} as ThemeConfig;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={mergedTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
