import React from 'react'
import { User } from '../../../Types/Interfaces/User'

const TmpProfile: React.FC<{ userData: User }> = ({ userData }) => {
  return (
    <>
      {JSON.stringify(userData)}
    </>
  )
}

export default TmpProfile