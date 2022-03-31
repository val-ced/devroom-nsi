import React from 'react'
import './Nav.scss'

const Nav = () => {
  return (
    <header>
      <nav id="nav-container">
        <div id="left-container">
          <div id="logo">

          </div>
          <div id="pipe">
            
          </div>
          <div id="logo-name">
            <p>
              DevRoom
            </p>
          </div>
        </div>
        <div id="search-container">
          <form action="" className="search-bar">
            <input type="text" placeholder="Search" name="q"/>
            <button type="submit"><span className="material-icons" id="icon-search">search</span></button>
          </form>
        </div>
        <div id="right-container">
          <div id="buttons">
            <a href="#" className="btn btn-login">Login</a>
            <a href="#" className="btn btn-account">Create account</a>
          </div>
        </div>
      </nav>
    </header> 
  ) 
}

export default Nav

// const Button: React.FC<{frame: boolean}> = ({children, frame = true}) => {
//   return (
//     <button style={{background: frame ? "" : "none"}}>{children}</button>
//   )
// }