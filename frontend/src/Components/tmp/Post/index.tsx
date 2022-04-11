import React from 'react'
import { Post } from '../../../Types/Interfaces/Post'

const TmpPost: React.FC<{ postData: Post }> = ({ postData }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white" }}>
      <p>{postData.author}</p>
      <p>{postData.date}</p>
      <p>{postData.body}</p>
    </div>
  )
}

export default TmpPost