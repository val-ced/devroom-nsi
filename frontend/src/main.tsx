import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { CookiesProvider } from 'react-cookie'
import Auth from './Auth'
import Routes from './Routes'
import { Route } from 'react-router-dom'
import Login from './Screens/Login'
import Error404 from './Screens/404'

ReactDOM.render(
  <Provider store={store}>
    <CookiesProvider>
      <Routes>
        <Route path="/" element={<Auth />}>
          <Route index element={<App />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </CookiesProvider>
  </Provider>,
  document.getElementById('root')
)
