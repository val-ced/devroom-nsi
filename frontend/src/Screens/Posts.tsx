import React from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import Post from '../Components/Post'
import TmpPost from '../Components/tmp/Post'
import { useGetUserPostsQuery } from '../redux/api/user'

const Posts: React.FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const at = matchPath("/users/:at/posts/", pathname)?.params.at

  const { data: dataPreview, isError, isLoading } = useGetUserPostsQuery({ at: at! })
  return (
    <div>
      {isError && <div>Error</div>}
      {isLoading && <div>Loading</div>}
      <div style={{ display: "flex", gap: "2em", flexDirection: "column", alignItems: "center", margin: "2em 0 2em 0" }}>
        {dataPreview?.results.map((post) => <div key={post.id} onClick={() => navigate(`/users/${post.author_meta.at}/posts/${post.id}`)}><Post {...post} /></div>)}
      </div>
    </div>
  )
}

export default Posts