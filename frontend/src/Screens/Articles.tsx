import React from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import ArticlePreview from '../Components/Article/ArticlePreview'
import { useGetUserArticlesQuery } from '../redux/api/user'

const Articles: React.FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const at = matchPath("/users/:at/articles/", pathname)?.params.at

  const { data: dataPreview, isError, isLoading } = useGetUserArticlesQuery({ at: at! })
  return (
    <div>
      {isError && <div>Error</div>}
      {isLoading && <div>Loading</div>}
      {dataPreview?.results.map((article) => <ArticlePreview key={article.id} {...article} />)}
    </div>
  )
}

export default Articles