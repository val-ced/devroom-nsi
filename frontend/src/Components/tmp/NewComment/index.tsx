import React, { useState } from 'react'
import { useNewCommentMutation } from '../../../redux/api/user'

const NewComment: React.FC<{ type: "article" | "post", uuid: string, refetch: () => void }> = ({ type, uuid, refetch }) => {
  const [commentValue, setCommentValue] = useState("")

  const [newComment] = useNewCommentMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (commentValue.length > 20) {
      const newC = await newComment({ body: commentValue, type, uuid }).unwrap()
      refetch()
      setCommentValue("")
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>New Comment</legend>
        <textarea name="" id="" cols={30} rows={10} value={commentValue} onChange={e => setCommentValue(e.currentTarget.value)}></textarea>
        <button type="submit">Comment</button>
      </fieldset>
    </form>
  )
}

export default NewComment