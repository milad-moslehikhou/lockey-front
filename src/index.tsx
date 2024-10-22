import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css'
declare global {
  interface Window {
    API_BASE_URL?: any
  }
}
require('typeface-roboto')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
