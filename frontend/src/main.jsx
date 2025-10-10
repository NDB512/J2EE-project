import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './Content/AuthContext.jsx'
import { Provider } from 'react-redux'
import Store from './Store.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <StrictMode>
      <GoogleOAuthProvider clientId="16664253465-u6iu5g4rg765io0hg4rdb1kjojipsejf.apps.googleusercontent.com">
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </StrictMode>
  </Provider>
)
