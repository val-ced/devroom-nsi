import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { CookiesProvider } from 'react-cookie'
import Auth from './Auth'
import Routes from './Routes'
import { Route } from 'react-router-dom'
import Login from './Screens/Login'
import Error404 from './Screens/404'
import NewArticle from './Screens/NewArticle'
import ArticleScreen from './Screens/ArticleScreen'
import Articles from './Screens/Articles'
import Posts from './Screens/Posts'
import PostScreen from './Screens/PostScreen'

ReactDOM.render(
  <Provider store={store}>
    <CookiesProvider>
      <Routes>
        <Route path="/" element={<Auth />}>
          <Route element={<App />}>
            <Route index element={<h1>Home</h1>} />
            <Route path="articles">
              <Route path="new" element={<NewArticle />} />
              <Route path=":uuid" element={<ArticleScreen />} />
            </Route>
            <Route path="users">
              <Route path=":at">
                <Route path="articles">
                  <Route index element={<Articles />} />
                  <Route path=":uuid" element={<ArticleScreen />} />
                </Route>
                <Route path="posts">
                  <Route index element={<Posts />} />
                  <Route path=":uuid" element={<PostScreen />} />
                </Route>
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Route>
      </Routes>
    </CookiesProvider>
  </Provider>,
  document.getElementById('root')
)
