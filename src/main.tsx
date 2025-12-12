import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import App from './App'
import './styles/globals.css'
import 'antd/dist/reset.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        hashed: false,
        token: {
          fontFamily: 'Inter Tight, IBM Plex Sans Condensed, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
          borderRadius: 4,
          paddingXS: 6,
          paddingSM: 8,
          padding: 12,
        },
        components: {
          Button: {
            controlHeight: 28,
            paddingInlineSM: 8,
          },
          Input: {
            controlHeight: 30,
          },
          InputNumber: {
            controlHeight: 30,
          },
          Card: {
            paddingLG: 14,
            padding: 12,
          },
        },
        algorithm: [theme.darkAlgorithm],
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
