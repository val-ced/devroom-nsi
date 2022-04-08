import React, { useEffect } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import Article from '../Components/Article'
import { useGetArticleQuery } from '../redux/api/articles'

const ArticleScreen: React.FC = () => {

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const uuid = matchPath("/users/:at/articles/:uuid", pathname)?.params.uuid

  useEffect(() => {
    if (!uuid) navigate("*")
  }, [])

  const { data: dataArticle, error, isLoading } = useGetArticleQuery(uuid!)

  return (
    <article>
      {isLoading && <div>Loading...</div>}
      {error && JSON.stringify(error)}
      {dataArticle && <Article body={dataArticle.body} title={dataArticle.title} />}
    </article>
  )
}

export default ArticleScreen