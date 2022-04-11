import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import NewComment from '../Components/tmp/NewComment'
import TmpPost from '../Components/tmp/Post'
import { useGetPostCommentsQuery, useGetPostQuery } from '../redux/api/posts'
import { Post } from '../Types/Interfaces/Post'

const PostScreen: React.FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const uuid = matchPath("/users/:at/posts/:uuid", pathname)?.params.uuid

  useEffect(() => {
    if (!uuid) navigate("*")
  }, [])


  const { data: dataPost, error: errorPost, isLoading: isLoadingPost } = useGetPostQuery(uuid!)

  const { data: dataComments, error: errorComments, isLoading: isLoadingComments, refetch } = useGetPostCommentsQuery({ uuid: uuid! }, { skip: !dataPost || dataPost.comments < 1 })

  useEffect(() => {

  }, [dataComments])

  return (
    <div>
      {isLoadingPost && <div>Loading...</div>}
      {errorPost && JSON.stringify(errorPost)}
      {dataPost &&
        <>
          <TmpPost postData={dataPost} />
          <NewComment type="post" uuid={dataPost.id} refetch={refetch} />
          {dataComments && <div>{dataComments.results.map(comment => <TmpPost key={comment.id} postData={comment} />)}</div>}
        </>
      }
    </div>
  )
}

export default PostScreen