import './App.scss'
import Nav from './Components/Nav'
import Post from './Components/Post'
import Logout from './Components/Logout'
import TmpProfile from './Components/tmp/Profile'
import { useGetArticleCommentsQuery, useGetArticleQuery, useGetMeQuery, useGetPostQuery } from './redux/api/apiAuth'
import TmpPost from './Components/tmp/Post'
import TmpArticle from './Components/tmp/Article'


function App() {

  const { data: dataMe, isError, isLoading, error } = useGetMeQuery()
  const { data: dataPost } = useGetPostQuery("fe3383c8-86e3-4289-9f7b-9be4a7797d96")
  const { data: dataComments } = useGetArticleCommentsQuery({ uuid: "c48a5fb9-3d88-495c-aa0c-77c7f5694c4c" })

  return (
    <>
      <Nav />
      <main>
        <Post />
        <Logout />
        {dataMe && <TmpProfile userData={dataMe} />}
        {dataPost && <TmpPost postData={dataPost} />}
        {dataComments && dataComments.results.map(post => {
          return <TmpPost key={post.id} postData={post} />
        })}
      </main>
    </>

  )
}

export default App
