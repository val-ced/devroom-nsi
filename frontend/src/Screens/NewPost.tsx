import React, { useState } from 'react'
import { useNewPostMutation } from '../redux/api/me'

const NewPost: React.FC = () => {
  const [body, setBody] = useState("")
  const [newPost] = useNewPostMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (body.length > 5) {
      const post = await newPost({ body }).unwrap()
      if (post) setBody("")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>New Post</legend>
        <label htmlFor="body">Post</label>
        <input name="body" type="text" value={body} onChange={(e) => setBody(e.currentTarget.value)} />
      </fieldset>
      <button type="submit">Post</button>
    </form>
  )
}

export default NewPost