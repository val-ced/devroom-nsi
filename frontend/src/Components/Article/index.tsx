import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { ArticleRequest } from '../../redux/api/me'

import 'katex/dist/katex.min.css'
import SyntaxHighlight from './SyntaxHighlight'

const Article: React.FC<ArticleRequest> = ({ body, title }) => {
  return (
    <article style={{ backgroundColor: "white" }}>
      {/* The inside should be touched. */}
      <h1>{title}</h1>
      <ReactMarkdown children={body} components={SyntaxHighlight} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} />
    </article>
  )
}

export default Article