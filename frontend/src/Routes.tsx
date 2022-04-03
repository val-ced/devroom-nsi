import React from 'react'
import { BrowserRouter, Routes as Switch } from 'react-router-dom'

const Routes: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <Switch>
        {children}
      </Switch>
    </BrowserRouter>
  )
}

export default Routes