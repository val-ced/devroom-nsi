import React from 'react'
import { Article } from '../../../Types/Interfaces/Article'

const TmpArticle: React.FC<{ articleData: Article }> = ({ articleData }) => {
  return (
    <>
      {JSON.stringify(articleData)}
    </>
  )
}

export default TmpArticle