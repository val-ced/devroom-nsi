import React, { useEffect } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import Article from '../Components/Article'
import NewComment from '../Components/tmp/NewComment'
import TmpPost from '../Components/tmp/Post'
import { useGetArticleCommentsQuery, useGetArticleQuery } from '../redux/api/articles'

const ArticleScreen: React.FC = () => {

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const uuid = matchPath("/users/:at/articles/:uuid", pathname)?.params.uuid

  useEffect(() => {
    if (!uuid) navigate("*")
  }, [])

  const { data: dataArticle, error, isLoading } = useGetArticleQuery(uuid!)
  const { data: dataComments, error: commentsError, isLoading: isLoadingComments, refetch } = useGetArticleCommentsQuery({ uuid: uuid! }, { skip: !dataArticle || dataArticle.comments < 1 })

  useEffect(() => { }, [dataComments])

  return (
    <article>
      {isLoading && <div>Loading...</div>}
      {error && JSON.stringify(error)}
      {dataArticle &&
        <>
          <Article body={dataArticle.body} title={dataArticle.title} />
          <NewComment type="article" uuid={dataArticle.id} refetch={refetch} />
          {dataComments && dataComments.results.map(comment => <TmpPost key={comment.id} postData={comment} />)}
        </>
      }
    </article>
  )
}

export default ArticleScreen