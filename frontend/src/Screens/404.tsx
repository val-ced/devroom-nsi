import React from 'react'
import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <>
      <h1>Not Found</h1>
      <Link to="/">Home</Link>
    </>
  )
}

export default Error404