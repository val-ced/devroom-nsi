import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleRequest, useNewArticleMutation } from '../redux/api/me'

const LazyArticle = React.lazy(() => import('../Components/Article'))

const NewArticle: React.FC = () => {
  const [newArticle, { isError, isLoading, isSuccess }] = useNewArticleMutation()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [view, setView] = useState<"editing" | "preview">("editing")

  const navigate = useNavigate()

  useEffect(() => {
    const draft = localStorage.getItem("draft")
    if (!draft) localStorage.setItem("draft", JSON.stringify({ title, body }))
    const draftParsed = JSON.parse(localStorage.getItem("draft")!) as ArticleRequest

    setBody(draftParsed.body)
    setTitle(draftParsed.title)

  }, [])

  useEffect(() => {
    localStorage.setItem("draft", JSON.stringify({ title, body }))
  }, [body, title])

  const handleNewArticle = async () => {
    if (body.length > 2 && title.length > 5) {
      const a = await newArticle({ body, title }).unwrap()
      if (a) {
        navigate(`/users/${a.author}/articles/${a.id}/`)
        localStorage.removeItem("draft")
      }
    }
  }

  return (
    <>
      <button onClick={() => setView("editing")} >Editing</button>
      <button onClick={() => setView("preview")} >Preview</button>
      {view === "editing" &&
        <form style={{ display: "flex", flexDirection: "column", width: "50vw" }}>
          <input type="text" value={title} placeholder="Title..." onChange={e => setTitle(e.currentTarget.value)} />
          <textarea style={{ width: "inherit" }} value={body} onChange={e => setBody(e.currentTarget.value)} name="body" cols={30} rows={10} placeholder="Content..." ></textarea>
        </form>}

      {view === "preview" &&
        <Suspense fallback={<div>Loading...</div>} >
          <LazyArticle body={body} title={title} />
        </Suspense>
      }
      <button onClick={handleNewArticle}>
        {
          isError ? "Error" : isLoading ? "Sending..." : isSuccess ? "Sent" :
            "Create new article"
        }
      </button>
    </>
  )
}

export default NewArticle