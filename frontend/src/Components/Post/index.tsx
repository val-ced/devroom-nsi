import React from 'react'
import "./Post.scss"

const Post:React.FC = () => {
  return (
    <section className="post-section">
      <div id="post-container">
        <div id="logo-container">
          <div id="logo">
            
          </div>
        </div>
        <div className="content-post-container">
          <div className="top-post-container">
              <div id="info-user">
                <p>Pseudo <span id="at">@at</span></p>
                <p id="date">date of publication</p>
              </div>
            <div id="settings-post">
              <button id="more-button"> 
                {/* Pense-bête : Ne pas oublier de faire une modal une fois tout le design fini. Voir kevin powell trop simple ^^ */}
                <span className="material-icons" id="more-post">more_horiz</span>
              </button>
            </div>
          </div>
          {/* End top-post-container */}
          <div id="content-post">
            <div id="text-area-post">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et tempora quo nobis quam excepturi minima asperiores sunt eius odit incidunt cumque expedita repellat totam, commodi eaque recusandae laboriosam reiciendis sapiente.
              </p>
            </div>
          </div>

          <div id="reactions-container">
            <span className="material-icons" id="icons-reactions">favorite</span><p id="text-reaction">like</p>
            <span className="material-icons" id="icons-reactions">chat_bubble</span><p id="text-reaction">comment</p>
          </div>
          {/* End reactions-container */}
        </div>
        {/* End content-post-container */}
      </div>
      {/* End post-container */}
    </section>

  )
}

export default Post