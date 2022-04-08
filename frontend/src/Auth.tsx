import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useRefreshMutation } from './redux/api/apiAuth';
import { cookies } from './redux/common';
import { setCredentials, logout, clearAccessToken } from './redux/services/auth/authSlice';
import { RootState } from './redux/store';

const Auth: React.FC = ({ children }) => {
  const dispatch = useDispatch()
  const [refreshToken] = useRefreshMutation()
  const { isLoggedIn, expires, access, refresh } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

  const refreshT = async () => {

    const _access = cookies.get("access")
    const _refresh = cookies.get("refresh")

    if (_refresh && !_access) {
      const a = await refreshToken(_refresh).unwrap()
      dispatch(setCredentials({ refresh: _refresh, access: a.access }))
      setLoading(false)
    } else if (_refresh && _access) {
      dispatch(setCredentials({ refresh: _refresh, access: _access }))
      setLoading(false)
      dispatch(clearAccessToken(expires))
    } else {
      dispatch(logout())
      setLoading(false)
      navigate("/login")
    }
  }

  useEffect(() => {
    refreshT()
  }, [access, refresh])

  useEffect(() => {
    if (isLoggedIn) {
      navigate(/^\/login.*/.test(location.pathname) ? "/" : location.pathname)
    }
  }, [isLoggedIn])

  return (
    <>
      {loading ? <h1>Loading...</h1> : <Outlet />}
    </>
  )
}

export default Auth