
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/services/auth/authSlice'
import { RootState } from '../../redux/store'

const Logout: React.FC = () => {
  const dispatch = useDispatch()
  const { access, refresh } = useSelector((state: RootState) => state.auth)
  return (
    <button disabled={!refresh} onClick={(e) => {
      if (refresh) {
        dispatch(logout())
      }
    }}>Logout</button>
  )
}

export default Logout