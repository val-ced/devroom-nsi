import './App.scss'
import Nav from './Components/Nav'
import Post from './Components/Post'
import Logout from './Components/Logout'


function App() {

  return (
    <>
      <Nav />
      <main>
        <Post />
        <Logout />
      </main>
    </>

  )
}

export default App
