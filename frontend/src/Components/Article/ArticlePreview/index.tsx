import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Article } from '../../../Types/Interfaces/Article'

const ArticlePreview: React.FC<Article> = (article) => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/users/${article.author}/articles/${article.id}/`)}>
      <h3>{article.title}</h3>
    </div>
  )
}

export default ArticlePreview