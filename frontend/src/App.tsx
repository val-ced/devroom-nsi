import { useState } from 'react'
import logo from './logo.svg'
import './App.scss'
import Nav from './Components/Nav'
import Post from './Components/Post'

function App() {

  return (
    <>
      <Nav />
      <main>
        <Post />
      </main>
    </>

  )
}

export default App
