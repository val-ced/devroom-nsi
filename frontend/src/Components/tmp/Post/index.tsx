import React from 'react'
import { Post } from '../../../Types/Interfaces/Post'

const TmpPost: React.FC<{ postData: Post }> = ({ postData }) => {
  return (
    <>
      {JSON.stringify(postData)}
    </>
  )
}

export default TmpPost